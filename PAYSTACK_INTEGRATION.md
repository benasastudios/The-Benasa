# Paystack Integration Guide - Client Side

## Prerequisites

1. Add Paystack script to your HTML (`index.html`)
2. Get your **Public Key** from Paystack Dashboard
3. Store it in Firebase Cloud Functions environment

## HTML Setup

Add this to the `<head>` of your pricing page:

```html
<script src="https://js.paystack.co/v1/inline.js"></script>
```

## Payment Flow

### Step 1: Initialize Payment (Get Reference & Metadata)

```javascript
async function getPaymentDetails(plan, email) {
  try {
    const initPayment = firebase.functions()
      .httpsCallable('initializePayment');
    
    const result = await initPayment({ plan });
    
    if (result.data.success) {
      return {
        publicKey: 'pk_live_xxxxx', // Get from env or config
        email: email,
        amount: result.data.amount,
        reference: result.data.reference,
        metadata: result.data.metadata,
        plan: plan
      };
    }
  } catch (error) {
    console.error('Error initializing payment:', error);
    alert('Payment initialization failed. Please try again.');
  }
}
```

### Step 2: Open Paystack Modal

```javascript
async function openPaystackModal(plan) {
  const user = firebase.auth().currentUser;
  
  if (!user) {
    alert('Please log in first');
    return;
  }

  const paymentDetails = await getPaymentDetails(plan, user.email);
  
  if (!paymentDetails) return;

  const handler = PaystackPop.setup({
    key: paymentDetails.publicKey,
    email: paymentDetails.email,
    amount: paymentDetails.amount,
    ref: paymentDetails.reference,
    metadata: paymentDetails.metadata,
    
    onClose: function() {
      console.log('Payment window closed');
      // User closed modal without completing
    },
    
    onSuccess: async function(response) {
      await verifyAndActivateSubscription(
        response.reference, 
        paymentDetails.plan,
        user.uid
      );
    }
  });

  handler.openIframe();
}
```

### Step 3: Verify Payment & Activate Subscription

```javascript
async function verifyAndActivateSubscription(reference, plan, userId) {
  try {
    const verifyPayment = firebase.functions()
      .httpsCallable('verifyPaystackPayment');
    
    const result = await verifyPayment({
      reference: reference,
      plan: plan,
      userId: userId
    });

    if (result.data.success) {
      alert('💳 Payment successful! Your subscription is now active.');
      
      // Show subscription details
      console.log('Subscription:', result.data.subscription);
      
      // Redirect or update UI
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    }
  } catch (error) {
    console.error('Verification failed:', error);
    alert('❌ Payment verification failed. Contact support if amount was charged.');
  }
}
```

## Add Payment Buttons to Pricing Cards

Modify your pricing cards in `index.html`:

```html
<!-- Starter Plan -->
<div class="pricing-card">
  <h4>Starter</h4>
  <span class="price-val" data-price-ghs="₵1,599" data-price-usd="$199">₵1,599</span>
  <button onclick="openPaystackModal('starter')" class="btn">
    Start Trial
  </button>
</div>

<!-- Standard Plan -->
<div class="pricing-card">
  <h4>Standard</h4>
  <span class="price-val" data-price-ghs="₵6,995" data-price-usd="$499">₵6,995</span>
  <button onclick="openPaystackModal('standard')" class="btn">
    Open Dept
  </button>
</div>

<!-- Plus Plan -->
<div class="pricing-card">
  <h4>Plus</h4>
  <span class="price-val" data-price-ghs="₵11,995" data-price-usd="$899">₵11,995</span>
  <button onclick="openPaystackModal('plus')" class="btn">
    Get Leverage
  </button>
</div>
```

## Environment Variables

Set these in Firebase Functions config:

```bash
firebase functions:config:set \
  paystack.public_key="pk_live_xxxxx" \
  paystack.secret_key="sk_live_xxxxx" \
  paystack.webhook_secret="webhook_secret_xxxxx" \
  --only functions
```

Then deploy:

```bash
firebase deploy --only functions
```

## Testing Locally

### 1. Get Paystack Test Keys

Visit [https://dashboard.paystack.com/settings/developer](https://dashboard.paystack.com/settings/developer)

Copy your **Test** keys:
- Public Key: `pk_test_...`
- Secret Key: `sk_test_...`

### 2. Use ngrok for Webhooks

```bash
npm install -g ngrok
ngrok http 5001

# Note the URL: https://xxxxx-xxx-xxx.ngrok.io
```

### 3. Update Paystack Webhook URL

Dashboard → Settings → Webhooks → Add:
```
https://YOUR_NGROK_URL/paystackWebhook
```

### 4. Test a Payment

Open your site and click "Start Trial" → Complete payment with test card:
- Card: `4084084084084081`
- Month/Year: Any future date
- CVV: Any 3 digits

## Security Considerations

✅ **Do:**
- Always verify payments on backend (Cloud Functions)
- Never trust client-side payment status
- Store references for reconciliation
- Log all payment events
- Use HTTPS everywhere

❌ **Don't:**
- Store card data
- Expose secret keys in frontend code
- Trust metadata from client directly
- Skip webhook signature verification

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Modal doesn't open | Ensure Paystack script is loaded, check browser console |
| Payment succeeds but subscription not created | Check Cloud Functions logs, verify webhook secret |
| Webhook not triggering | Verify URL in Paystack dashboard, check ngrok is running |
| Account charges but subscription fails | Contact users, manual creation via Firebase console |
