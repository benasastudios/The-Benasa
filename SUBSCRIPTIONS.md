# Paystack Subscription System

## Firestore Schema

### Collection: `subscriptions`
Stores user subscription data. Document key = `userId`

```javascript
{
  userId: "auth_uid_here",
  plan: "starter" | "standard" | "plus",
  status: "active" | "paused" | "past_due" | "free_tier" | "cancelled" | "expired",
  
  // Paystack details
  paystackReference: "charge_reference_xyz",
  amount: 199 (in cents or smallest unit),
  customerEmail: "user@example.com",
  
  // Dates
  startDate: Timestamp,
  nextBillingDate: Timestamp,
  lastPaymentDate: Timestamp,
  
  // Pause tracking
  pausedAt: Timestamp | null,
  pauseReason: string | null,
  resumedAt: Timestamp | null,
  downgradedAt: Timestamp | null,
  
  // Cancellation
  cancelledAt: Timestamp | null,
  cancellationReason: string | null,
  
  // Failed payment tracking
  failedPaymentDate: Timestamp | null,
  failureReason: string | null,
  
  lastPaymentAmount: number
}
```

## Status Flow

```
free_tier
   ↓ (user purchases plan via Paystack)
active
   ├→ (payment succeeds) [stays active]
   └→ (user pauses)
      paused
      ├→ (user resumes within 30 days) → active
      ├→ (30+ days paused) → auto-downgrade (via Cloud Function)
      └→ free_tier
            ├→ (user buys again) → active
            └→ (explicitly cancel) → cancelled

active
   └→ (payment fails) → past_due
      ├→ (user retries payment) → active
      └→ (30 days no payment) → downgrade to free_tier
```

## Setup Instructions

### 1. Environment Variables (Firebase Project)

Set these in Firebase Functions environment:

```bash
firebase functions:config:set paystack.webhook_secret="pk_test_xxxxx" --only functions
```

Or in `.env.local` for local development:

```
PAYSTACK_WEBHOOK_SECRET=pk_test_xxxxx
```

### 2. Paystack Webhook Setup

1. Log into [Paystack Dashboard](https://dashboard.paystack.com)
2. Go to **Settings → API Keys & Webhooks**
3. Under **Webhooks**, add endpoint:
   ```
   https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/paystackWebhook
   ```
4. Copy the webhook signature secret
5. Subscribe to these events:
   - `charge.success`
   - `charge.failed`

### 3. Cloud Scheduler Setup (Auto-downgrade)

Deploy the Cloud Function first:

```bash
firebase deploy --only functions
```

Then enable Cloud Scheduler:

```bash
gcloud scheduler jobs create pubsub autoDowngradeExpiredPaused \
  --schedule="0 0 * * *" \
  --topic=functions-schedule-autoDowngradeExpiredPaused \
  --location=us-central1
```

This runs daily at midnight UTC to downgrade subscriptions paused for 30+ days.

### 4. Security Rules (Firestore)

Add these rules to `firestore.rules`:

```
match /subscriptions/{userId} {
  allow read: if request.auth.uid == userId;
  allow write: if request.auth.uid == userId && 
               (request.resource.data.status == 'paused' ||
                request.resource.data.status == 'cancelled');
}
```

## Client-Side Usage

### Initiate Payment (Paystack modal)

```javascript
const paystackKey = 'pk_test_xxxxx'; // Your Paystack public key

async function initializePayment(plan, email, phoneNumber) {
  const prices = {
    starter: 199 * 100,   // GHS 1,599 ≈ $199 in cents
    standard: 499 * 100,  // GHS 6,995 ≈ $499
    plus: 899 * 100       // GHS 11,995 ≈ $899
  };

  const handler = PaystackPop.setup({
    key: paystackKey,
    email: email,
    amount: prices[plan] * 100, // Convert to cents
    ref: `${plan}-${Date.now()}`, // Unique reference
    onClose: function() {
      alert('Window closed.');
    },
    onSuccess: async function(response) {
      // Verify payment on backend before granting access
      const result = await firebase.functions()
        .httpsCallable('verifyPaystackPayment')({
          reference: response.reference,
          userId: firebase.auth().currentUser.uid,
          plan: plan
        });

      if (result.data.success) {
        alert('Payment successful! Your subscription is active.');
        window.location.href = '/';
      }
    }
  });

  handler.openIframe();
}
```

### Check Subscription Status

```javascript
async function checkSubscriptionStatus() {
  const getStatus = firebase.functions()
    .httpsCallable('getSubscriptionStatus');
  
  const result = await getStatus();
  return result.data; // { status, plan, nextBillingDate, etc. }
}
```

### Pause Subscription

```javascript
async function pauseSubscription(reason = null) {
  const pauseSub = firebase.functions()
    .httpsCallable('pauseSubscription');
  
  const result = await pauseSub({ reason });
  alert(result.data.message);
}
```

### Resume Subscription

```javascript
async function resumeSubscription() {
  const resumeSub = firebase.functions()
    .httpsCallable('resumeSubscription');
  
  const result = await resumeSub({});
  alert(result.data.message);
}
```

### Cancel Subscription

```javascript
async function cancelSubscription(reason = null) {
  if (confirm('Are you sure? You can pause instead to keep access.')) {
    const cancelSub = firebase.functions()
      .httpsCallable('cancelSubscription');
    
    const result = await cancelSub({ reason });
    alert(result.data.message);
  }
}
```

## Important Notes

- **Pause is better than cancel**: Users can resume instantly without re-signup friction
- **Auto-downgrade after 30 days**: Prevents indefinite free-like paused state
- **Grace period for payment failures**: 30 days to fix payment method before losing access
- **Webhook verification**: Always verify webhook signatures to prevent fraud
- **Timezone**: Auto-downgrade runs at 00:00 UTC; adjust via Cloud Scheduler if needed

## Testing

### Local Webhook Testing

Use Paystack's test keys:
- **Public Key**: `pk_test_...`
- **Secret Key**: `sk_test_...`

To test webhooks locally, use ngrok:

```bash
ngrok http 5001
# Then update webhook URL in Paystack dashboard to: https://YOUR_NGROK_URL/paystackWebhook
```

### Test Charge.Success

```bash
curl -X POST http://localhost:5001/paystackWebhook \
  -H "Content-Type: application/json" \
  -H "x-paystack-signature: HASH_HERE" \
  -d '{
    "event": "charge.success",
    "data": {
      "reference": "test_ref_123",
      "amount": 19900,
      "customer": { "email": "test@example.com" },
      "metadata": { "userId": "user123", "plan": "starter" }
    }
  }'
```

## Troubleshooting

- **Webhooks not hitting**: Check webhook URL in Paystack dashboard
- **Signature verification failing**: Ensure `PAYSTACK_WEBHOOK_SECRET` is correct
- **Auto-downgrade not running**: Verify Cloud Scheduler job is enabled
- **Subscription not updating**: Check Firestore security rules allow writes from Cloud Functions (deploy via `firebase deploy`)
