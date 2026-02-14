# How to Get SMTP Settings for Custom Domain Email

When you buy a domain (like `jerzeyLab.com`) and create an email address (like `info@jerzeyLab.com`), you need to know where to find the SMTP settings. Here's a comprehensive guide:

## Where SMTP Settings Come From

SMTP settings depend on **where you host your email**. The email hosting can be:
1. **Your domain registrar** (if they provide email hosting)
2. **Your web hosting provider** (cPanel, Plesk, etc.)
3. **Third-party email service** (Google Workspace, Microsoft 365, etc.)

---

## Option 1: Email Hosting from Your Domain Registrar

Many domain registrars (GoDaddy, Namecheap, Google Domains, etc.) offer email hosting.

### How to Find SMTP Settings:

1. **Log into your domain registrar account**
2. **Navigate to Email/Email Hosting section**
3. **Look for "Email Settings", "SMTP Settings", or "Mail Server Settings"**
4. **Common SMTP settings you'll find:**

   **For GoDaddy:**
   ```
   SMTP_HOST: smtpout.secureserver.net
   SMTP_PORT: 465 (SSL) or 587 (TLS)
   SMTP_SECURE: true (for 465) or false (for 587)
   EMAIL_USER: info@jerzeyLab.com
   EMAIL_PASSWORD: your-email-password
   ```

   **For Namecheap:**
   ```
   SMTP_HOST: mail.privateemail.com
   SMTP_PORT: 465 (SSL) or 587 (TLS)
   SMTP_SECURE: true (for 465) or false (for 587)
   EMAIL_USER: info@jerzeyLab.com
   EMAIL_PASSWORD: your-email-password
   ```

   **For Google Domains (with Google Workspace):**
   ```
   SMTP_HOST: smtp.gmail.com
   SMTP_PORT: 587
   SMTP_SECURE: false
   EMAIL_USER: info@jerzeyLab.com
   EMAIL_PASSWORD: your-app-password (not regular password)
   ```

---

## Option 2: Email Hosting from Your Web Hosting Provider

If you host your website with providers like Bluehost, HostGator, SiteGround, etc., they usually provide email hosting through **cPanel**.

### How to Find SMTP Settings in cPanel:

1. **Log into cPanel** (usually `yourdomain.com/cpanel`)
2. **Go to "Email Accounts"** section
3. **Click on "Connect Devices" or "Configure Mail Client"** next to your email
4. **Look for "Manual Settings" or "SMTP Settings"**
5. **Common cPanel SMTP settings:**

   ```
   SMTP_HOST: mail.yourdomain.com (or yourdomain.com)
   SMTP_PORT: 587 (TLS) or 465 (SSL)
   SMTP_SECURE: false (for 587) or true (for 465)
   EMAIL_USER: info@jerzeyLab.com
   EMAIL_PASSWORD: your-email-password
   ```

   **Example:**
   ```
   SMTP_HOST: mail.jerzeyLab.com
   SMTP_PORT: 587
   SMTP_SECURE: false
   EMAIL_USER: info@jerzeyLab.com
   EMAIL_PASSWORD: your-password
   ```

---

## Option 3: Google Workspace (G Suite)

If you use Google Workspace for your custom domain email:

### Setup Steps:

1. **Sign up for Google Workspace** (paid service, ~$6/month per user)
2. **Verify your domain** with Google
3. **Create the email address** `info@jerzeyLab.com` in Google Workspace admin
4. **Enable 2-Step Verification** for the account
5. **Generate an App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "JerseyLab" as the name
   - Copy the 16-character password

### SMTP Settings:

```
EMAIL_SERVICE: gmail
EMAIL_USER: info@jerzeyLab.com
EMAIL_PASSWORD: your-16-character-app-password
EMAIL_FROM: "JerseyLab <info@jerzeyLab.com>"
```

**OR using SMTP:**
```
SMTP_HOST: smtp.gmail.com
SMTP_PORT: 587
SMTP_SECURE: false
EMAIL_USER: info@jerzeyLab.com
EMAIL_PASSWORD: your-16-character-app-password
EMAIL_FROM: "JerseyLab <info@jerzeyLab.com>"
```

---

## Option 4: Microsoft 365 (Office 365)

If you use Microsoft 365 for your custom domain email:

### SMTP Settings:

```
SMTP_HOST: smtp.office365.com
SMTP_PORT: 587
SMTP_SECURE: false
EMAIL_USER: info@jerzeyLab.com
EMAIL_PASSWORD: your-microsoft-password
EMAIL_FROM: "JerseyLab <info@jerzeyLab.com>"
```

---

## Option 5: Zoho Mail (Free Option)

Zoho offers free email hosting for custom domains:

### SMTP Settings:

```
SMTP_HOST: smtp.zoho.com
SMTP_PORT: 587
SMTP_SECURE: false
EMAIL_USER: info@jerzeyLab.com
EMAIL_PASSWORD: your-zoho-password
EMAIL_FROM: "JerseyLab <info@jerzeyLab.com>"
```

**OR for Zoho EU:**
```
SMTP_HOST: smtp.zoho.eu
SMTP_PORT: 587
SMTP_SECURE: false
```

---

## Option 6: SendGrid (Recommended for Production)

SendGrid is a professional email service that works great with custom domains:

### Setup Steps:

1. **Sign up at https://sendgrid.com** (free tier: 100 emails/day)
2. **Verify your domain** `jerzeyLab.com` in SendGrid
3. **Create an API Key** with "Mail Send" permissions
4. **Use these settings:**

```
SMTP_HOST: smtp.sendgrid.net
SMTP_PORT: 587
SMTP_SECURE: false
EMAIL_USER: apikey
EMAIL_PASSWORD: SG.your-sendgrid-api-key-here
EMAIL_FROM: "JerseyLab <info@jerzeyLab.com>"
```

**Note:** The `EMAIL_USER` is literally the word `apikey`, and `EMAIL_PASSWORD` is your SendGrid API key.

---

## How to Find Your SMTP Settings (Step-by-Step)

### Step 1: Identify Your Email Hosting Provider

Check where you created/manage your email:
- **Domain registrar dashboard?** → Check their email settings
- **cPanel?** → Check email accounts section
- **Google Workspace?** → Use Gmail SMTP settings
- **Microsoft 365?** → Use Office 365 SMTP settings
- **Third-party service?** → Check their documentation

### Step 2: Look for These Terms in Your Dashboard

Search for:
- "SMTP Settings"
- "Mail Server Settings"
- "Email Configuration"
- "Outgoing Mail Server"
- "Configure Mail Client"
- "Email Client Setup"

### Step 3: Common SMTP Host Formats

Your SMTP host is usually one of these:
- `mail.yourdomain.com`
- `smtp.yourdomain.com`
- `mail.yourhostingprovider.com`
- `smtp.yourhostingprovider.com`
- `yourdomain.com` (sometimes)

### Step 4: Test Your Settings

Once you have the settings, you can test them by:
1. Setting up the environment variables
2. Starting your server
3. Looking for: `✅ Email server is ready to send messages` in the logs

---

## Quick Reference: Common SMTP Ports

- **Port 587 (TLS/STARTTLS)** - Most common, use `SMTP_SECURE: false`
- **Port 465 (SSL)** - Older but still used, use `SMTP_SECURE: true`
- **Port 25** - Usually blocked by ISPs, not recommended

---

## Recommended Setup for JerseyLab

### For Development/Testing:
- Use **Gmail** with App Password (if you have a Gmail account)
- Or use **Zoho Mail** (free for custom domains)

### For Production:
- Use **SendGrid** (best for transactional emails, free tier available)
- Or **Google Workspace** (if you need full email features)
- Or your **web hosting provider's email** (if included with hosting)

---

## Need Help?

If you're not sure where your email is hosted:

1. **Check your domain registrar** - They usually list email hosting options
2. **Check your web hosting** - If you have web hosting, email is usually included
3. **Check your email provider** - Look at where you log in to check emails
4. **Contact support** - Your domain registrar or hosting provider can help

Once you have the SMTP settings, add them to your `.env` file (for local development) or Render dashboard (for production).


