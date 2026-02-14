# Render Deployment Guide for JerseyLab Backend

This guide will help you deploy the JerseyLab backend server to Render.

## Prerequisites

1. A Render account (sign up at https://render.com)
2. MongoDB Atlas account (for production database)
3. Stripe account (for payments)
4. Email service credentials (Gmail or SMTP)

## Step 1: Create MongoDB Atlas Database

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user
4. Whitelist Render's IP addresses (or use 0.0.0.0/0 for all IPs - less secure but easier)
5. Get your connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/Jerseylab?retryWrites=true&w=majority`)

## Step 2: Deploy Backend to Render

### Option A: Using render.yaml (Recommended)

1. **Push your code to GitHub** (if not already done)
   ```bash
   git add render.yaml
   git commit -m "Add Render deployment configuration"
   git push
   ```

2. **Connect Render to GitHub**
   - Go to https://dashboard.render.com
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml` and create the service

3. **Set Environment Variables in Render Dashboard**
   - Go to your service → Environment
   - Add the following variables (mark `sync: false` ones manually):

#### Required Variables:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/Jerseylab?retryWrites=true&w=majority
CLIENT_URL=https://yourusername.github.io/Jersey-lab
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

#### Email Configuration (choose one):

**Option 1: Gmail**
```
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=JerseyLab <your-email@gmail.com>
```

**Option 2: SMTP**
```
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-email@domain.com
EMAIL_PASSWORD=your-password
EMAIL_FROM=JerseyLab <your-email@domain.com>
```

#### Optional Variables:
```
GOOGLE_CLIENT_ID=your-google-client-id (if using Google OAuth)
GOOGLE_CLIENT_SECRET=your-google-client-secret (if using Google OAuth)
GOOGLE_CALLBACK_URL=https://jerzey-lab-api.onrender.com/api/auth/google/callback
CLIENT_URLS=https://yourusername.github.io/Jersey-lab,https://your-custom-domain.com
```

### Option B: Manual Setup

1. **Create a new Web Service**
   - Go to https://dashboard.render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure the Service**
   - **Name**: `jerzey-lab-api`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: Leave empty (or set to `server` if you want)
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`

3. **Set Environment Variables** (same as Option A)

## Step 3: Configure Stripe Webhook

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter your webhook URL: `https://jerzey-lab-api.onrender.com/api/webhooks/stripe`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add it to Render environment variables as `STRIPE_WEBHOOK_SECRET`

## Step 4: Update Frontend

1. Update your frontend environment variable:
   ```env
   VITE_API_URL=https://jerzey-lab-api.onrender.com
   ```

2. Rebuild and deploy your frontend:
   ```bash
   cd client
   npm run build:github
   git add docs
   git commit -m "Update API URL for production"
   git push
   ```

## Step 5: Test the Deployment

1. **Check Service Health**
   - Visit: `https://jerzey-lab-api.onrender.com/api/health` (if you have a health endpoint)
   - Check Render logs for any errors

2. **Test API Endpoints**
   - Test a simple endpoint: `https://jerzey-lab-api.onrender.com/api/categories`
   - Check CORS is working correctly

3. **Test Stripe Integration**
   - Use Stripe test mode first
   - Test payment flow end-to-end

## Important Notes

### Free Tier Limitations
- Render free tier services **spin down after 15 minutes of inactivity**
- First request after spin-down may take 30-60 seconds (cold start)
- Consider upgrading to paid plan for production

### Security Best Practices
1. **Never commit `.env` files** - Use Render environment variables
2. **Use strong SESSION_SECRET** - Render generates this automatically
3. **Restrict MongoDB IP whitelist** - Only allow Render IPs if possible
4. **Use HTTPS** - Render provides this automatically
5. **Keep Stripe keys secure** - Never expose in client-side code

### Monitoring
- Check Render logs regularly: Dashboard → Your Service → Logs
- Set up alerts for service failures
- Monitor MongoDB Atlas for database performance

### Troubleshooting

**Service won't start:**
- Check build logs in Render dashboard
- Verify all environment variables are set
- Check `package.json` has correct `start` script

**Database connection errors:**
- Verify MongoDB Atlas IP whitelist includes Render IPs
- Check connection string format
- Verify database user credentials

**CORS errors:**
- Verify `CLIENT_URL` matches your frontend URL exactly
- Check `CLIENT_URLS` if using multiple frontend URLs
- Ensure frontend is making requests to correct API URL

**Email not sending:**
- Verify email credentials are correct
- For Gmail, use App Password (not regular password)
- Check email service logs in Render

## Next Steps

1. Set up custom domain (optional)
2. Configure auto-deploy from GitHub
3. Set up monitoring and alerts
4. Test all features in production
5. Switch Stripe to live mode when ready

## Support

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com

