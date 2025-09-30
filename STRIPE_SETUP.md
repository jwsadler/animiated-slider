# Stripe Integration Setup Guide

This guide will help you set up Stripe payments with the animated slider component.

## Prerequisites

1. **Stripe Account**: Create a free account at [stripe.com](https://stripe.com)
2. **Backend Server**: You'll need a backend to create PaymentIntents securely
3. **React Native App**: With the animated slider component installed

## 1. Stripe Dashboard Setup

### Get Your API Keys
1. Log into your [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to **Developers** → **API Keys**
3. Copy your **Publishable Key** (starts with `pk_test_` for test mode)
4. Copy your **Secret Key** (starts with `sk_test_` for test mode) - **Keep this secure!**

### Enable Payment Methods
1. Go to **Settings** → **Payment Methods**
2. Enable the payment methods you want to support:
   - Cards (Visa, Mastercard, etc.)
   - Apple Pay (for iOS)
   - Google Pay (for Android)

## 2. Backend Setup

### Install Stripe SDK
```bash
npm install stripe express
```

### Create PaymentIntent Endpoint
Use the provided `example/backend-example.js` as a starting point:

```javascript
const stripe = require('stripe')('sk_test_YOUR_SECRET_KEY');

app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: 'usd',
    automatic_payment_methods: { enabled: true },
  });

  res.json({ client_secret: paymentIntent.client_secret });
});
```

### Environment Variables
Create a `.env` file:
```
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## 3. React Native Setup

### Install Dependencies
```bash
npm install @stripe/stripe-react-native
```

### iOS Setup
Add to your `ios/Podfile`:
```ruby
pod 'stripe-react-native', :path => '../node_modules/@stripe/stripe-react-native'
```

Run:
```bash
cd ios && pod install
```

### Android Setup
No additional setup required for basic card payments.

## 4. Component Integration

### Basic Usage
```tsx
import { PaymentScreen, StripeConfig } from 'react-native-animated-slider';

const stripeConfig: StripeConfig = {
  publishableKey: 'pk_test_your_publishable_key_here',
  merchantIdentifier: 'merchant.com.yourapp', // For Apple Pay
};

const handleStripePayment = async (amount: number) => {
  const response = await fetch('https://your-backend.com/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: amount * 100 }), // Convert to cents
  });
  
  const { client_secret } = await response.json();
  return { clientSecret: client_secret };
};

<PaymentScreen
  stripeConfig={stripeConfig}
  onStripePayment={handleStripePayment}
  onPaymentPress={(method, amount) => {
    console.log('Payment:', method, amount);
  }}
/>
```

## 5. Testing

### Test Card Numbers
Use these test cards in development:

| Card Number | Brand | Description |
|-------------|-------|-------------|
| 4242424242424242 | Visa | Succeeds |
| 4000000000000002 | Visa | Declined |
| 4000000000009995 | Visa | Insufficient funds |
| 5555555555554444 | Mastercard | Succeeds |

### Test Flow
1. Enter a test amount (e.g., $10.00)
2. Select "New Card (Stripe)" payment method
3. Enter test card: `4242 4242 4242 4242`
4. Enter any future expiry date (e.g., 12/25)
5. Enter any 3-digit CVC (e.g., 123)
6. Tap "Pay $10.00"

## 6. Production Checklist

### Security
- [ ] Never expose secret keys in client-side code
- [ ] Use HTTPS for all API endpoints
- [ ] Validate amounts on the server
- [ ] Implement proper authentication

### Stripe Dashboard
- [ ] Switch to live mode
- [ ] Update API keys to live keys (`pk_live_` and `sk_live_`)
- [ ] Set up webhooks for production URL
- [ ] Configure business information

### App Store / Play Store
- [ ] Add payment processing to app description
- [ ] Ensure compliance with store policies
- [ ] Test with real cards in production

## 7. Webhooks (Recommended)

Set up webhooks to handle payment events:

1. Go to **Developers** → **Webhooks** in Stripe Dashboard
2. Add endpoint: `https://your-backend.com/stripe-webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy the webhook signing secret

## 8. Error Handling

Common errors and solutions:

| Error | Solution |
|-------|----------|
| "Invalid publishable key" | Check your publishable key format |
| "No such payment_intent" | Verify client_secret is correct |
| "Your card was declined" | Use test cards or check real card |
| "Network error" | Check backend URL and connectivity |

## 9. Support

- **Stripe Documentation**: [stripe.com/docs](https://stripe.com/docs)
- **React Native Stripe**: [github.com/stripe/stripe-react-native](https://github.com/stripe/stripe-react-native)
- **Component Issues**: Create an issue in this repository

## Example Configuration

See `example/StripePaymentExample.tsx` for a complete working example.

---

**Need Help?** 
- Check the Stripe Dashboard logs for payment details
- Use Stripe's test mode for development
- Contact support if you encounter issues
