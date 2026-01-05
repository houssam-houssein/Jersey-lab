import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  // For development, you can use Gmail or other SMTP services
  // For production, consider using services like SendGrid, Mailgun, or AWS SES
  
  // Gmail configuration (requires app password)
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD // Use App Password for Gmail
      }
    })
  }
  
  // Generic SMTP configuration
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    })
  }
  
  // Default: Use Ethereal Email for testing (no real emails sent)
  // Visit https://ethereal.email to view sent emails
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: process.env.ETHEREAL_USER || 'ethereal.user@ethereal.email',
      pass: process.env.ETHEREAL_PASS || 'ethereal.pass'
    }
  })
}

const transporter = createTransporter()

// Welcome email template
export const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || `"JerseyLab" <${process.env.EMAIL_USER || 'noreply@jerzeylab.com'}>`,
      to: userEmail,
      subject: 'Welcome to JerseyLab! 🏀',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .container {
              background-color: #ffffff;
              border-radius: 8px;
              padding: 40px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 32px;
              font-weight: bold;
              color: #000000;
              margin-bottom: 10px;
            }
            .content {
              color: #555555;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background-color: #000000;
              color: #ffffff;
              text-decoration: none;
              border-radius: 4px;
              margin: 20px 0;
              font-weight: 600;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eeeeee;
              text-align: center;
              font-size: 12px;
              color: #999999;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">JerseyLab</div>
            </div>
            <div class="content">
              <h2>Welcome to JerseyLab, ${userName}! 🏀</h2>
              <p>Thank you for joining our community of athletes, influencers, and basketball enthusiasts.</p>
              <p>We're excited to have you on board! At JerseyLab, we create premium athletic wear that represents the culture and passion of the game.</p>
              <p>Here's what you can do next:</p>
              <ul>
                <li>Browse our exclusive collections</li>
                <li>Shop professional athlete jerseys</li>
                <li>Explore custom teamwear options</li>
                <li>Stay updated with the latest drops</li>
              </ul>
              <div style="text-align: center;">
                <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" class="button">Start Shopping</a>
              </div>
              <p>If you have any questions, feel free to reach out to our support team.</p>
              <p>Welcome to the family!</p>
              <p style="margin-top: 30px;">
                Best regards,<br>
                <strong>The JerseyLab Team</strong>
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} JerseyLab. All rights reserved.</p>
              <p>You're receiving this email because you signed up for a JerseyLab account.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to JerseyLab, ${userName}!
        
        Thank you for joining our community of athletes, influencers, and basketball enthusiasts.
        
        We're excited to have you on board! At JerseyLab, we create premium athletic wear that represents the culture and passion of the game.
        
        Start shopping: ${process.env.CLIENT_URL || 'http://localhost:5173'}
        
        If you have any questions, feel free to reach out to our support team.
        
        Welcome to the family!
        
        Best regards,
        The JerseyLab Team
        
        © ${new Date().getFullYear()} JerseyLab. All rights reserved.
      `
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Welcome email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending welcome email:', error)
    // Don't throw error - email failure shouldn't break signup
    return { success: false, error: error.message }
  }
}

// Teamwear inquiry notification email to owner
export const sendTeamwearInquiryNotification = async (ownerEmail, inquiry) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || `"JerseyLab" <${process.env.EMAIL_USER || 'noreply@jerzeylab.com'}>`,
      to: ownerEmail,
      subject: `New Teamwear Inquiry from ${inquiry.firstName} ${inquiry.lastName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .container {
              background-color: #ffffff;
              border-radius: 8px;
              padding: 40px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 32px;
              font-weight: bold;
              color: #000000;
              margin-bottom: 10px;
            }
            .content {
              color: #555555;
            }
            .inquiry-details {
              background-color: #f9f9f9;
              border-left: 4px solid #bfff00;
              padding: 20px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .detail-row {
              margin: 10px 0;
            }
            .detail-label {
              font-weight: 600;
              color: #000000;
            }
            .detail-value {
              color: #555555;
              margin-left: 10px;
            }
            .description-box {
              background-color: #ffffff;
              border: 1px solid #e0e0e0;
              padding: 15px;
              border-radius: 4px;
              margin-top: 10px;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eeeeee;
              text-align: center;
              font-size: 12px;
              color: #999999;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">JerseyLab</div>
            </div>
            <div class="content">
              <h2>New Teamwear Inquiry Received 🏀</h2>
              <p>You have received a new teamwear inquiry that requires your attention.</p>
              
              <div class="inquiry-details">
                <div class="detail-row">
                  <span class="detail-label">Name:</span>
                  <span class="detail-value">${inquiry.firstName} ${inquiry.lastName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Email:</span>
                  <span class="detail-value"><a href="mailto:${inquiry.email}">${inquiry.email}</a></span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Phone:</span>
                  <span class="detail-value"><a href="tel:${inquiry.phoneNumber}">${inquiry.phoneNumber}</a></span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Submitted:</span>
                  <span class="detail-value">${new Date(inquiry.createdAt || new Date()).toLocaleString()}</span>
                </div>
                ${inquiry.fileName ? `
                <div class="detail-row">
                  <span class="detail-label">Design File:</span>
                  <span class="detail-value">${inquiry.fileName}</span>
                </div>
                ` : ''}
                <div class="detail-row" style="margin-top: 15px;">
                  <span class="detail-label">Description:</span>
                </div>
                <div class="description-box">
                  ${inquiry.description.replace(/\n/g, '<br>')}
                </div>
              </div>
              
              <p style="margin-top: 30px;">
                Please review this inquiry in your admin dashboard and respond to the customer as soon as possible.
              </p>
              <p style="margin-top: 30px;">
                Best regards,<br>
                <strong>The JerseyLab System</strong>
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} JerseyLab. All rights reserved.</p>
              <p>This is an automated notification from the JerseyLab teamwear inquiry system.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        New Teamwear Inquiry Received
        
        You have received a new teamwear inquiry that requires your attention.
        
        Name: ${inquiry.firstName} ${inquiry.lastName}
        Email: ${inquiry.email}
        Phone: ${inquiry.phoneNumber}
        Submitted: ${new Date(inquiry.createdAt || new Date()).toLocaleString()}
        ${inquiry.fileName ? `Design File: ${inquiry.fileName}` : ''}
        
        Description:
        ${inquiry.description}
        
        Please review this inquiry in your admin dashboard and respond to the customer as soon as possible.
        
        Best regards,
        The JerseyLab System
        
        © ${new Date().getFullYear()} JerseyLab. All rights reserved.
        This is an automated notification from the JerseyLab teamwear inquiry system.
      `
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Teamwear inquiry notification email sent to owner:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending teamwear inquiry notification email:', error)
    // Don't throw error - email failure shouldn't break inquiry submission
    return { success: false, error: error.message }
  }
}

// Verify email configuration
export const verifyEmailConfig = async () => {
  try {
    await transporter.verify()
    console.log('✅ Email server is ready to send messages')
    return true
  } catch (error) {
    console.warn('⚠️  Email configuration issue:', error.message)
    console.warn('   Emails will not be sent, but signup will still work')
    return false
  }
}

