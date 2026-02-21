const functions = require('firebase-functions');
const admin = require('firebase-admin');

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
