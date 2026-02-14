# Email Configuration Guide

This guide will help you configure email functionality for JerseyLab. The application supports multiple email services.

## Required Environment Variables

You need to set up the following environment variables for email to work:

### Option 1: Gmail (Recommended for Development)

1. **Enable 2-Step Verification** on your Google account
2. **Generate an App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "JerseyLab" as the name
   - Copy the generated 16-character password

3. **Set these environment variables:**
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=info@jerzeyLab.com
   EMAIL_PASSWORD=your-16-character-app-password
   EMAIL_FROM="JerseyLab <info@jerzeyLab.com>"
   ```

### Option 2: Generic SMTP (For Production)

For production, you can use services like:
- **SendGrid** (recommended)
- **Mailgun**
- **AWS SES**
- **Any SMTP server**

**Set these environment variables:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
EMAIL_FROM="JerseyLab <info@jerzeyLab.com>"
```

### Option 3: SendGrid Example

1. Sign up at https://sendgrid.com
2. Create an API key with "Mail Send" permissions
3. Set these environment variables:
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_SECURE=false
   EMAIL_USER=apikey
   EMAIL_PASSWORD=SG.your-sendgrid-api-key-here
   EMAIL_FROM="JerseyLab <info@jerzeyLab.com>"
   ```

## Local Development Setup

1. Create a `.env` file in the `server` directory
2. Add your email configuration variables (see options above)
3. Restart your server

Example `.env` file:
```env
# Email Configuration (Gmail example)
EMAIL_SERVICE=gmail
EMAIL_USER=info@jerzeyLab.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM="JerseyLab <info@jerzeyLab.com>"

# Other required variables
MONGODB_URI=mongodb://127.0.0.1:27017/Jerseylab
CLIENT_URL=http://localhost:5173
SESSION_SECRET=your-secret-key-here
```

## Render Deployment Setup

1. Go to your Render dashboard
2. Select your service
3. Go to "Environment" tab
4. Add the following environment variables:
   - `EMAIL_SERVICE` (set to `gmail` if using Gmail, or leave empty for SMTP)
   - `SMTP_HOST` (if using generic SMTP)
   - `SMTP_PORT` (usually `587`)
   - `SMTP_SECURE` (set to `true` for port 465, `false` for other ports)
   - `EMAIL_USER` (your email address or SMTP username)
   - `EMAIL_PASSWORD` (your email password or SMTP password/API key)
   - `EMAIL_FROM` (e.g., `"JerseyLab <info@jerzeyLab.com>"`)

## Testing Email Configuration

The server will automatically verify email configuration on startup. You should see:
- ✅ `Email server is ready to send messages` (if configured correctly)
- ⚠️ `Email configuration issue: ...` (if there's a problem)

## Email Features

The application sends emails for:
- ✅ Welcome emails (new user signups)
- ✅ Order confirmations (to admins)
- ✅ Teamwear inquiry notifications (to admins)
- ✅ Admin password reset links

## Troubleshooting

### Gmail Issues
- Make sure you're using an **App Password**, not your regular Gmail password
- Enable 2-Step Verification first
- Check that "Less secure app access" is not needed (App Passwords replace this)

### SMTP Issues
- Verify your SMTP host and port are correct
- Check that your credentials are correct
- For SendGrid, make sure your API key has "Mail Send" permissions
- Check firewall/network settings if emails aren't sending

### General Issues
- Check server logs for detailed error messages
- Verify all environment variables are set correctly
- Test with a simple email service first (like Gmail) before moving to production services

