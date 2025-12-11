# Email Configuration Guide

This guide explains how to set up email sending for welcome emails when users sign up.

## Quick Setup Options

### Option 1: Gmail (Easiest for Development)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Create an app password for "Mail"
3. Add to your `.env` file:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-here
EMAIL_FROM="Jerzey LAB <your-email@gmail.com>"
```

### Option 2: Generic SMTP (Any Email Provider)

Add to your `.env` file:

```env
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-email@domain.com
EMAIL_PASSWORD=your-password
EMAIL_FROM="Jerzey LAB <your-email@domain.com>"
```

### Option 3: Testing with Ethereal Email (No Real Emails)

For development/testing, you can use Ethereal Email (free test service):

1. Visit https://ethereal.email
2. Create a test account
3. Add to your `.env`:

```env
ETHEREAL_USER=your-ethereal-username
ETHEREAL_PASS=your-ethereal-password
```

**Note:** Emails sent via Ethereal won't actually be delivered, but you can view them at ethereal.email

## Production Recommendations

For production, consider using:
- **SendGrid** (Free tier: 100 emails/day)
- **Mailgun** (Free tier: 5,000 emails/month)
- **AWS SES** (Very affordable, pay per email)
- **Resend** (Modern email API)

## Environment Variables

Add these to your `server/.env` file:

```env
# Email Configuration
EMAIL_SERVICE=gmail                    # or leave empty for SMTP
SMTP_HOST=smtp.gmail.com              # Only if using generic SMTP
SMTP_PORT=587                          # Only if using generic SMTP
SMTP_SECURE=false                      # Only if using generic SMTP
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-password-or-app-password
EMAIL_FROM="Jerzey LAB <noreply@jerzeylab.com>"

# Client URL (used in email links)
CLIENT_URL=http://localhost:5173       # or your production URL
```

## Testing

After setting up, restart your server. You should see:
```
✅ Email server is ready to send messages
```

If you see a warning, check your email configuration.

## Troubleshooting

- **Gmail "Less secure app" error**: Use App Password instead of regular password
- **Connection timeout**: Check firewall/network settings
- **Authentication failed**: Verify username/password are correct
- **Emails not sending**: Check server logs for specific error messages

## Notes

- Email sending is non-blocking - if email fails, signup still succeeds
- Welcome emails are sent automatically when users sign up (both regular and Google OAuth)
- Email failures are logged but don't affect the signup process

