const functions = require('firebase-functions');
const admin = require('firebase-admin');
const crypto = require('crypto');
const axios = require('axios');

// Initialize Admin SDK (uses default service account when deployed)
admin.initializeApp();

/**
 * Callable function to set/unset the `admin` custom claim for a user.
 * Security model:
 * - Caller must be authenticated
 * - Caller must already be an admin (has `admin` claim) OR be listed in `project_owners/{callerUid}`
 * - This prevents arbitrary users from elevating privileges.
 *
 * Usage (client):
 * const setAdmin = firebase.functions().httpsCallable('setAdminClaim');
 * setAdmin({ uid: targetUid, makeAdmin: true });
 */
exports.setAdminClaim = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required.');
  }

  const callerUid = context.auth.uid;
  const callerClaims = context.auth.token || {};
  const isCallerAdmin = callerClaims.admin === true;

  const db = admin.firestore();

  if (!isCallerAdmin) {
    // Allow if the caller is a documented project owner
    const ownerDoc = await db.collection('project_owners').doc(callerUid).get();
    if (!ownerDoc.exists) {
      throw new functions.https.HttpsError('permission-denied', 'Caller is not authorized to set admin claims.');
    }
  }

  const targetUid = data && data.uid;
  if (!targetUid || typeof targetUid !== 'string') {
    throw new functions.https.HttpsError('invalid-argument', 'Missing or invalid `uid` parameter.');
  }

  const makeAdmin = !!data.makeAdmin;

  try {
    await admin.auth().setCustomUserClaims(targetUid, { admin: makeAdmin });
    return { success: true, uid: targetUid, admin: makeAdmin };
  } catch (err) {
    console.error('Failed to set custom claims:', err);
    throw new functions.https.HttpsError('internal', 'Failed to set custom claims.');
  }
});

/**
 * Callable function to list users for the admin dashboard.
 * - Only callable by authenticated admins or documented project owners
 * - Returns a sanitized list of users (no sensitive tokens)
 * Usage (client):
 * const listUsers = firebase.functions().httpsCallable('listUsers');
 * const result = await listUsers();
 */
exports.listUsers = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required.');
  }

  const callerUid = context.auth.uid;
  const callerClaims = context.auth.token || {};
  const isCallerAdmin = callerClaims.admin === true;

  const db = admin.firestore();

  if (!isCallerAdmin) {
    // Allow if the caller is a documented project owner
    const ownerDoc = await db.collection('project_owners').doc(callerUid).get();
    if (!ownerDoc.exists) {
      throw new functions.https.HttpsError('permission-denied', 'Caller is not authorized to list users.');
    }
  }

  try {
    // Fetch first page of users (up to 1000). For larger orgs, implement pagination.
    const usersResult = await admin.auth().listUsers(1000);
    const users = usersResult.users.map(u => ({
      uid: u.uid,
      email: u.email || null,
      displayName: u.displayName || null,
      photoURL: u.photoURL || null,
      disabled: !!u.disabled,
      metadata: {
        creationTime: u.metadata ? u.metadata.creationTime : null,
        lastSignInTime: u.metadata ? u.metadata.lastSignInTime : null
      },
      customClaims: u.customClaims || {}
    }));

    return { success: true, users };
  } catch (err) {
    console.error('Error listing users:', err);
    throw new functions.https.HttpsError('internal', 'Failed to list users.');
  }
});

/**
 * Paystack Webhook Handler
 * Handles charge.success and charge.failed events
 * Webhook secret set in environment: PAYSTACK_WEBHOOK_SECRET
 */
exports.paystackWebhook = functions.https.onRequest(async (req, res) => {
  const db = admin.firestore();
  const secret = process.env.PAYSTACK_WEBHOOK_SECRET || '';
  
  // Verify webhook signature
  const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
  if (hash !== req.headers['x-paystack-signature']) {
    console.error('Invalid Paystack webhook signature');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { event, data } = req.body;
  const { reference, customer, amount, metadata = {} } = data;

  try {
    if (event === 'charge.success') {
      const { userId, plan } = metadata;
      
      if (!userId) {
        console.warn('charge.success: No userId in metadata');
        return res.status(400).json({ error: 'Missing userId' });
      }

      // Create/update subscription in Firestore
      await db.collection('subscriptions').doc(userId).set({
        userId,
        plan,
        status: 'active',
        paystackReference: reference,
        amount,
        customerEmail: customer.email,
        startDate: new Date(),
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        pausedAt: null,
        cancelledAt: null,
        lastPaymentDate: new Date(),
        lastPaymentAmount: amount
      }, { merge: true });

      // Send confirmation email (optional - requires email service setup)
      console.log(`Subscription activated for user ${userId}, plan: ${plan}`);
      
      res.status(200).json({ success: true });
    } 
    else if (event === 'charge.failed') {
      const { userId } = metadata;
      
      if (!userId) {
        console.warn('charge.failed: No userId in metadata');
        return res.status(400).json({ error: 'Missing userId' });
      }

      // Update subscription to past_due
      await db.collection('subscriptions').doc(userId).update({
        status: 'past_due',
        failedPaymentDate: new Date(),
        failureReason: data.failure_reason || 'Unknown'
      });

      console.log(`Payment failed for user ${userId}`);
      res.status(200).json({ success: true });
    } 
    else {
      res.status(200).json({ success: true }); // Accept unknown events
    }
  } catch (error) {
    console.error('Error processing Paystack webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Auto-downgrade subscriptions paused for 30+ days
 * Run daily via Cloud Scheduler
 */
exports.autoDowngradeExpiredPaused = functions.pubsub.schedule('every day 00:00').onRun(async (context) => {
  const db = admin.firestore();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  try {
    const snapshot = await db.collection('subscriptions')
      .where('status', '==', 'paused')
      .where('pausedAt', '<=', thirtyDaysAgo)
      .get();

    let downgradedCount = 0;
    const batch = db.batch();

    snapshot.forEach(doc => {
      batch.update(doc.ref, {
        status: 'free_tier',
        downgradedAt: new Date(),
        downgradedReason: 'auto_downgrade_after_30_days_paused'
      });
      downgradedCount++;
    });

    await batch.commit();
    console.log(`Auto-downgraded ${downgradedCount} subscriptions from paused to free_tier`);
  } catch (error) {
    console.error('Error in autoDowngradeExpiredPaused:', error);
  }
});

/**
 * Pause subscription (callable function)
 * User can easily resume later with one click
 */
exports.pauseSubscription = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required.');
  }

  const userId = context.auth.uid;
  const db = admin.firestore();

  try {
    await db.collection('subscriptions').doc(userId).update({
      status: 'paused',
      pausedAt: new Date(),
      pauseReason: data.reason || null
    });

    return { success: true, message: 'Subscription paused. You can resume anytime.' };
  } catch (error) {
    console.error('Error pausing subscription:', error);
    throw new functions.https.HttpsError('internal', 'Failed to pause subscription');
  }
});

/**
 * Resume paused subscription (callable function)
 */
exports.resumeSubscription = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required.');
  }

  const userId = context.auth.uid;
  const db = admin.firestore();

  try {
    const subDoc = await db.collection('subscriptions').doc(userId).get();
    
    if (!subDoc.exists || subDoc.data().status !== 'paused') {
      throw new functions.https.HttpsError('failed-precondition', 'Subscription is not paused');
    }

    await db.collection('subscriptions').doc(userId).update({
      status: 'active',
      pausedAt: null,
      resumedAt: new Date()
    });

    return { success: true, message: 'Subscription resumed!' };
  } catch (error) {
    console.error('Error resuming subscription:', error);
    throw new functions.https.HttpsError('internal', 'Failed to resume subscription');
  }
});

/**
 * Cancel subscription (callable function)
 * After 30-60 days paused, user should explicitly cancel instead of staying paused
 */
exports.cancelSubscription = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required.');
  }

  const userId = context.auth.uid;
  const db = admin.firestore();

  try {
    await db.collection('subscriptions').doc(userId).update({
      status: 'cancelled',
      cancelledAt: new Date(),
      cancellationReason: data.reason || null
    });

    return { success: true, message: 'Subscription cancelled.' };
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    throw new functions.https.HttpsError('internal', 'Failed to cancel subscription');
  }
});

/**
 * Get subscription status (callable function)
 */
exports.getSubscriptionStatus = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required.');
  }

  const userId = context.auth.uid;
  const db = admin.firestore();

  try {
    const subDoc = await db.collection('subscriptions').doc(userId).get();
    
    if (!subDoc.exists) {
      return { 
        status: 'free_tier',
        plan: null
      };
    }

    return subDoc.data();
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    throw new functions.https.HttpsError('internal', 'Failed to fetch subscription status');
  }
});

/**
 * Verify Paystack payment and create subscription
 * Called after successful payment in frontend modal
 */
exports.verifyPaystackPayment = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required.');
  }

  const { reference, plan } = data;
  const userId = context.auth.uid;
  const db = admin.firestore();
  const secretKey = process.env.PAYSTACK_SECRET_KEY || '';

  if (!reference || !plan) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing reference or plan');
  }

  try {
    // Verify payment with Paystack API
    const verifyUrl = `https://api.paystack.co/transaction/verify/${reference}`;
    const response = await axios.get(verifyUrl, {
      headers: {
        Authorization: `Bearer ${secretKey}`
      }
    });

    if (!response.data.status || !response.data.data) {
      throw new functions.https.HttpsError('failed-precondition', 'Payment verification failed');
    }

    const { status, data: paymentData } = response.data;

    if (status !== true || paymentData.status !== 'success') {
      throw new functions.https.HttpsError('failed-precondition', 'Payment was not successful');
    }

    // Verify metadata matches
    if (paymentData.metadata.userId !== userId || paymentData.metadata.plan !== plan) {
      console.warn('Metadata mismatch for payment verification');
      throw new functions.https.HttpsError('failed-precondition', 'Payment metadata mismatch');
    }

    // Create subscription in Firestore
    const nextBillingDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    await db.collection('subscriptions').doc(userId).set({
      userId,
      plan,
      status: 'active',
      paystackReference: reference,
      amount: paymentData.amount,
      customerEmail: paymentData.customer.email,
      startDate: new Date(),
      nextBillingDate,
      pausedAt: null,
      cancelledAt: null,
      lastPaymentDate: new Date(),
      lastPaymentAmount: paymentData.amount
    }, { merge: true });

    return { 
      success: true, 
      message: 'Subscription activated!',
      subscription: {
        plan,
        status: 'active',
        nextBillingDate: nextBillingDate.toISOString()
      }
    };
  } catch (error) {
    console.error('Error verifying Paystack payment:', error);
    if (error.isAxiosError) {
      console.error('Paystack API Error:', error.response?.data);
    }
    throw new functions.https.HttpsError('internal', 'Payment verification failed');
  }
});

/**
 * Initialize payment reference for Paystack
 * Generate reference and metadata for charge
 */
exports.initializePayment = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required.');
  }

  const { plan } = data;
  const userId = context.auth.uid;
  const email = context.auth.token.email;

  const validPlans = {
    starter: { amount: 19900, currency: 'GHS' },
    standard: { amount: 49900, currency: 'GHS' },
    plus: { amount: 89900, currency: 'GHS' }
  };

  if (!validPlans[plan]) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid plan');
  }

  try {
    const reference = `benasa-${plan}-${userId}-${Date.now()}`;
    
    return {
      success: true,
      reference,
      amount: validPlans[plan].amount,
      email,
      metadata: {
        userId,
        plan
      }
    };
  } catch (error) {
    console.error('Error initializing payment:', error);
    throw new functions.https.HttpsError('internal', 'Failed to initialize payment');
  }
});
