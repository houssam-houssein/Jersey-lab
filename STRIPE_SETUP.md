# Stripe Payment Integration Setup

This document explains how to set up Stripe payment integration for the JerseyLab e-commerce site.

## Required Environment Variables

### Backend (server/.env)

Add the following environment variables to your `server/.env` file:

```env
# Stripe Secret Key (get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# Stripe Webhook Secret (get from https://dashboard.stripe.com/webhooks)
# This is used to verify webhook events from Stripe
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### Frontend (client/.env)

Add the following environment variable to your `client/.env` file:

```env
# Stripe Publishable Key (get from https://dashboard.stripe.com/apikeys)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

## Setup Steps

1. **Create a Stripe Account**
   - Go to https://stripe.com and create an account
   - Complete the account setup process

2. **Get Your API Keys**
   - Go to https://dashboard.stripe.com/apikeys
   - Copy your **Publishable key** (starts with `pk_test_` for test mode)
   - Copy your **Secret key** (starts with `sk_test_` for test mode)
   - Add them to your environment variables

3. **Set Up Webhooks** (for production)
   - Go to https://dashboard.stripe.com/webhooks
   - Click "Add endpoint"
   - Enter your webhook URL: `https://your-api-domain.com/api/webhooks/stripe`
   - Select events to listen for:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
   - Copy the **Signing secret** (starts with `whsec_`)
   - Add it to your backend environment variables

4. **Test the Integration**
   - Use Stripe test cards: https://stripe.com/docs/testing
   - Test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
   - Any ZIP code

## Current Implementation

The payment flow works as follows:

1. User clicks "Proceed to Checkout" from the cart
2. User fills in shipping address on checkout page
3. Backend creates a Stripe Payment Intent
4. User enters payment details using Stripe Elements
5. Payment is processed through Stripe
6. Order is created in the database
7. User sees order confirmation

## Placeholder Keys

Currently, the code uses placeholder keys that need to be replaced:
- Backend: `sk_test_placeholder_key_replace_with_real_key`
- Frontend: `pk_test_placeholder_key_replace_with_real_key`
- Webhook: `whsec_placeholder_secret_replace_with_real_secret`

**Important:** Replace these with your actual Stripe keys before going to production!

## Production Checklist

- [ ] Replace test keys with live keys
- [ ] Set up production webhook endpoint
- [ ] Test payment flow end-to-end
- [ ] Set up order confirmation emails
- [ ] Configure shipping calculation
- [ ] Set up tax calculation
- [ ] Test refund process
- [ ] Set up order management dashboard

