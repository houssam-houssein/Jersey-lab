# Payment Flow - Where Does the Money Go?

## Quick Answer

**When customers pay on your live website, the money goes to YOUR Stripe account, and then Stripe automatically transfers it to YOUR connected bank account.**

## Detailed Payment Flow

### Step-by-Step Process:

1. **Customer Makes Payment**
   - Customer enters payment details on your checkout page
   - Payment is processed through Stripe (using your Stripe API keys)

2. **Money Goes to Stripe**
   - Stripe receives the payment from the customer's card
   - Money is held in your Stripe account balance
   - Stripe takes their processing fee (typically 2.9% + $0.30 per transaction)

3. **Stripe Transfers to Your Bank**
   - Stripe automatically transfers the money (minus fees) to your connected bank account
   - Transfer schedule depends on your account setup:
     - **New accounts**: 7-14 days (rolling reserve)
     - **Established accounts**: Daily, weekly, or monthly (you can choose)
     - **Instant payouts**: Available for eligible accounts (small fee applies)

## Setting Up Your Bank Account in Stripe

### To Receive Payments:

1. **Complete Stripe Account Setup**
   - Go to https://dashboard.stripe.com
   - Complete your business information
   - Verify your identity (required for live payments)

2. **Add Bank Account**
   - Go to: Settings → Bank accounts and scheduling
   - Click "Add bank account"
   - Enter your bank account details:
     - Account number
     - Routing number
     - Account holder name
   - Verify the account (Stripe will make small test deposits)

3. **Set Payout Schedule**
   - Choose when you want to receive money:
     - **Daily**: Money arrives every business day
     - **Weekly**: Money arrives on a specific day
     - **Monthly**: Money arrives on a specific date
   - Note: First payout may take 7-14 days

## Important Information

### Stripe Fees

Stripe charges a processing fee for each transaction:
- **Online payments**: 2.9% + $0.30 per successful card charge
- **Example**: $100 order = $2.90 + $0.30 = $3.20 fee
- **You receive**: $100 - $3.20 = $96.80

### Payment Timeline

- **Customer pays**: Money is charged immediately
- **Stripe processes**: Usually instant
- **Money in Stripe balance**: Available immediately (but not yet in your bank)
- **Transfer to your bank**: Based on your payout schedule (daily/weekly/monthly)
- **Money in your bank**: 1-2 business days after Stripe initiates transfer

### Example Timeline

**Scenario: Daily Payout Schedule**

- **Monday 10 AM**: Customer pays $100
- **Monday 10:01 AM**: Payment processed, $96.80 in Stripe balance
- **Tuesday 2 AM**: Stripe initiates transfer to your bank
- **Wednesday**: Money appears in your bank account

## Where to Check Your Money

### 1. Stripe Dashboard
- Go to https://dashboard.stripe.com
- Click "Payments" to see all transactions
- Click "Balance" to see your current Stripe balance
- Click "Payouts" to see transfer history

### 2. Your Bank Account
- Check your bank statement
- Look for transfers from "Stripe" or "STRIPE.COM"
- Transfer descriptions usually include transaction details

## Security & Compliance

### Stripe Handles:
- ✅ PCI compliance (you don't need to worry about storing card details)
- ✅ Fraud detection
- ✅ Chargeback handling
- ✅ Tax reporting (1099-K forms for US accounts)

### Your Responsibilities:
- ✅ Fulfill orders (ship products)
- ✅ Handle customer service
- ✅ Process refunds if needed (through Stripe dashboard)

## Test Mode vs Live Mode

### Test Mode (Current Setup)
- Uses test API keys (`sk_test_...` and `pk_test_...`)
- **No real money** is processed
- Test cards don't charge real cards
- Use for development and testing

### Live Mode (Production)
- Uses live API keys (`sk_live_...` and `pk_live_...`)
- **Real money** is processed
- Real cards are charged
- Money goes to your real bank account
- **Switch to live mode only when ready for real customers!**

## Switching to Live Mode

1. **Get Live API Keys**
   - Go to Stripe Dashboard → Developers → API keys
   - Toggle from "Test mode" to "Live mode"
   - Copy your live keys:
     - `sk_live_...` (Secret key)
     - `pk_live_...` (Publishable key)

2. **Update Environment Variables**
   - In Render dashboard, update:
     - `STRIPE_SECRET_KEY` = your live secret key
   - In your frontend build, update:
     - `VITE_STRIPE_PUBLISHABLE_KEY` = your live publishable key

3. **Update Webhook**
   - Create a new webhook endpoint in live mode
   - Update `STRIPE_WEBHOOK_SECRET` in Render

4. **Test with Small Amount**
   - Make a test purchase with a real card
   - Verify money appears in your Stripe balance
   - Verify transfer to your bank account

## Common Questions

### Q: Can I change my bank account?
**A:** Yes, go to Stripe Dashboard → Settings → Bank accounts. You can add multiple accounts and choose which one to use.

### Q: What if a customer disputes a charge?
**A:** Stripe will notify you. You can respond through the Stripe dashboard. If you lose the dispute, the money is refunded and a chargeback fee applies.

### Q: How do I issue a refund?
**A:** Go to Stripe Dashboard → Payments → Select payment → Refund. Money is returned to customer's card.

### Q: When will I get my first payout?
**A:** New Stripe accounts typically have a 7-14 day rolling reserve. After that, payouts follow your schedule.

### Q: Can I see payment details?
**A:** Yes, all payment details are in your Stripe dashboard, including customer email, amount, fees, and status.

## Summary

**Money Flow:**
```
Customer's Card → Stripe Account → Your Bank Account
     ($100)         ($96.80)          ($96.80)
                    (-$3.20 fee)
```

**Key Points:**
- Money goes to YOUR Stripe account (linked to YOUR API keys)
- Stripe automatically transfers to YOUR connected bank account
- You must complete Stripe account setup and add a bank account
- Stripe takes a small processing fee (2.9% + $0.30)
- First payout may take 7-14 days, then follows your schedule

## Need Help?

- Stripe Support: https://support.stripe.com
- Stripe Dashboard: https://dashboard.stripe.com
- Stripe Documentation: https://stripe.com/docs

