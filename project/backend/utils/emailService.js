import nodemailer from 'nodemailer';
import { getQuoteEmailTemplate, getBookingConfirmationTemplate, getVerificationEmailTemplate, getPasswordResetEmailTemplate } from './emailTemplates.js';

// Create transporter - uses SMTP if configured, falls back to Gmail OAuth2
const createTransporter = () => {
  const user = process.env.GMAIL_USER || process.env.EMAIL_USER || 'info@skyriting.com';
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
  
  // Use SMTP if host is configured (more reliable)
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || user,
        pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
      },
    });
  }
  
  // Use Gmail with App Password (simpler than OAuth2)
  if (process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: user,
        pass: process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASS,
      },
    });
  }
  
  // Fall back to Gmail OAuth2
  if (clientId && clientSecret && refreshToken) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: user,
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
      },
    });
  }
  
  // Last resort: SMTP with provided credentials or dummy (will fail gracefully)
  console.warn('⚠️  No email credentials configured. Email sending will be skipped.');
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'ethereal_user@example.com',
      pass: 'ethereal_pass',
    },
  });
};

const FROM_EMAIL = process.env.GMAIL_USER || process.env.EMAIL_USER || process.env.SMTP_USER || 'info@skyriting.com';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.GMAIL_USER || process.env.EMAIL_USER || 'admin@skyriting.com';

/**
 * Send quote email with Skyriting branding
 */
export async function sendQuoteEmail(quote, recipientEmail) {
  try {
    const transporter = createTransporter();
    const html = await getQuoteEmailTemplate(quote);
    
    const mailOptions = {
      from: `Skyriting <${FROM_EMAIL}>`,
      to: recipientEmail,
      subject: `Your Skyriting Quote - ${quote.quoteNumber}`,
      html,
      replyTo: FROM_EMAIL,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Quote email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending quote email:', error);
    throw error;
  }
}

/**
 * Send booking confirmation email
 */
export async function sendBookingConfirmation(booking) {
  try {
    const transporter = createTransporter();
    const html = await getBookingConfirmationTemplate(booking);
    
    const mailOptions = {
      from: `Skyriting <${FROM_EMAIL}>`,
      to: booking.contactInfo.email,
      subject: `Booking Confirmation - ${booking.bookingNumber}`,
      html,
      replyTo: FROM_EMAIL,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Booking confirmation email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending booking confirmation:', error);
    throw error;
  }
}

/**
 * Send reschedule notification
 */
export async function sendRescheduleNotification(booking, rescheduleRequest) {
  try {
    const transporter = createTransporter();
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .status { padding: 10px; margin: 10px 0; border-radius: 5px; }
          .approved { background: #d4edda; color: #155724; }
          .rejected { background: #f8d7da; color: #721c24; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Skyriting</h1>
          </div>
          <div class="content">
            <h2>Reschedule Request ${rescheduleRequest.status === 'approved' ? 'Approved' : 'Rejected'}</h2>
            <p>Dear ${booking.contactInfo.name},</p>
            <p>Your reschedule request for booking ${booking.bookingNumber} has been <strong>${rescheduleRequest.status}</strong>.</p>
            ${rescheduleRequest.status === 'approved' ? `
              <p><strong>New Departure Date:</strong> ${new Date(rescheduleRequest.newDate).toLocaleDateString()}</p>
            ` : ''}
            <p><strong>Reason:</strong> ${rescheduleRequest.reason}</p>
            <p>If you have any questions, please contact us.</p>
            <p>Best regards,<br>Skyriting Team</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const mailOptions = {
      from: `Skyriting <${FROM_EMAIL}>`,
      to: booking.contactInfo.email,
      subject: `Reschedule ${rescheduleRequest.status === 'approved' ? 'Approved' : 'Rejected'} - ${booking.bookingNumber}`,
      html,
      replyTo: FROM_EMAIL,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Reschedule notification sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending reschedule notification:', error);
    throw error;
  }
}

/**
 * Send admin notification for new inquiry/contact/career/service
 */
export async function sendAdminNotification(data) {
  try {
    const transporter = createTransporter();
    
    let html = '';
    let subject = '';
    let title = '';

    if (data.type === 'contact' && data.inquiry) {
      const inquiry = data.inquiry;
      title = 'New Contact Inquiry';
      subject = `New Contact Inquiry from ${inquiry.name}`;
      html = generateAdminEmailHtml(title, `
        <h2>New Contact Inquiry Received</h2>
        <table style="width:100%;border-collapse:collapse;margin:10px 0">
          <tr><td style="padding:8px;border-bottom:1px solid #ddd"><strong>Name:</strong></td><td style="padding:8px;border-bottom:1px solid #ddd">${inquiry.name}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #ddd"><strong>Email:</strong></td><td style="padding:8px;border-bottom:1px solid #ddd">${inquiry.email}</td></tr>
          ${inquiry.phone ? `<tr><td style="padding:8px;border-bottom:1px solid #ddd"><strong>Phone:</strong></td><td style="padding:8px;border-bottom:1px solid #ddd">${inquiry.phone}</td></tr>` : ''}
          <tr><td style="padding:8px;border-bottom:1px solid #ddd"><strong>Subject:</strong></td><td style="padding:8px;border-bottom:1px solid #ddd">${inquiry.subject}</td></tr>
        </table>
        <p><strong>Message:</strong></p><p style="background:#f5f5f5;padding:15px;border-radius:4px">${inquiry.message}</p>
      `);
    } else if (data.type === 'career' && data.application) {
      const app = data.application;
      title = 'New Career Application';
      subject = `New Career Application from ${app.name} - ${app.position}`;
      html = generateAdminEmailHtml(title, `
        <h2>New Career Application Received</h2>
        <table style="width:100%;border-collapse:collapse;margin:10px 0">
          <tr><td style="padding:8px;border-bottom:1px solid #ddd"><strong>Name:</strong></td><td style="padding:8px;border-bottom:1px solid #ddd">${app.name}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #ddd"><strong>Email:</strong></td><td style="padding:8px;border-bottom:1px solid #ddd">${app.email}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #ddd"><strong>Phone:</strong></td><td style="padding:8px;border-bottom:1px solid #ddd">${app.phone}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #ddd"><strong>Position:</strong></td><td style="padding:8px;border-bottom:1px solid #ddd">${app.position}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #ddd"><strong>Experience:</strong></td><td style="padding:8px;border-bottom:1px solid #ddd">${app.experience}</td></tr>
          ${app.resume ? `<tr><td style="padding:8px;border-bottom:1px solid #ddd"><strong>Resume:</strong></td><td style="padding:8px;border-bottom:1px solid #ddd"><a href="${app.resume}">View Resume</a></td></tr>` : ''}
        </table>
        ${app.coverLetter ? `<p><strong>Cover Letter:</strong></p><p style="background:#f5f5f5;padding:15px;border-radius:4px">${app.coverLetter}</p>` : ''}
      `);
    } else if (data.type === 'service' && data.inquiry) {
      const inquiry = data.inquiry;
      title = 'New Service Inquiry';
      subject = `New Service Inquiry: ${inquiry.serviceName} from ${inquiry.name}`;
      html = generateAdminEmailHtml(title, `
        <h2>New Service Inquiry Received</h2>
        <table style="width:100%;border-collapse:collapse;margin:10px 0">
          <tr><td style="padding:8px;border-bottom:1px solid #ddd"><strong>Service:</strong></td><td style="padding:8px;border-bottom:1px solid #ddd">${inquiry.serviceName}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #ddd"><strong>Name:</strong></td><td style="padding:8px;border-bottom:1px solid #ddd">${inquiry.name}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #ddd"><strong>Email:</strong></td><td style="padding:8px;border-bottom:1px solid #ddd">${inquiry.email}</td></tr>
          ${inquiry.phone ? `<tr><td style="padding:8px;border-bottom:1px solid #ddd"><strong>Phone:</strong></td><td style="padding:8px;border-bottom:1px solid #ddd">${inquiry.phone}</td></tr>` : ''}
          ${inquiry.company ? `<tr><td style="padding:8px;border-bottom:1px solid #ddd"><strong>Company:</strong></td><td style="padding:8px;border-bottom:1px solid #ddd">${inquiry.company}</td></tr>` : ''}
          <tr><td style="padding:8px;border-bottom:1px solid #ddd"><strong>Subject:</strong></td><td style="padding:8px;border-bottom:1px solid #ddd">${inquiry.subject}</td></tr>
        </table>
        <p><strong>Message:</strong></p><p style="background:#f5f5f5;padding:15px;border-radius:4px">${inquiry.message}</p>
      `);
    } else if (data.type === 'package' && data.inquiry) {
      const inquiry = data.inquiry;
      title = 'New Package Inquiry';
      subject = `New Package Inquiry: ${inquiry.packageName} from ${inquiry.name}`;
      html = generateAdminEmailHtml(title, `
        <h2>New Package Inquiry Received</h2>
        <table style="width:100%;border-collapse:collapse;margin:10px 0">
          <tr><td style="padding:8px;border-bottom:1px solid #ddd"><strong>Package:</strong></td><td style="padding:8px;border-bottom:1px solid #ddd">${inquiry.packageName}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #ddd"><strong>Name:</strong></td><td style="padding:8px;border-bottom:1px solid #ddd">${inquiry.name}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #ddd"><strong>Email:</strong></td><td style="padding:8px;border-bottom:1px solid #ddd">${inquiry.email}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #ddd"><strong>Phone:</strong></td><td style="padding:8px;border-bottom:1px solid #ddd">${inquiry.phone}</td></tr>
          ${inquiry.selectedPackageType ? `<tr><td style="padding:8px;border-bottom:1px solid #ddd"><strong>Package Type:</strong></td><td style="padding:8px;border-bottom:1px solid #ddd">${inquiry.selectedPackageType}</td></tr>` : ''}
          ${inquiry.selectedPackage ? `<tr><td style="padding:8px;border-bottom:1px solid #ddd"><strong>Selected Package:</strong></td><td style="padding:8px;border-bottom:1px solid #ddd">${inquiry.selectedPackage}</td></tr>` : ''}
          ${inquiry.selectedDate ? `<tr><td style="padding:8px;border-bottom:1px solid #ddd"><strong>Selected Date:</strong></td><td style="padding:8px;border-bottom:1px solid #ddd">${inquiry.selectedDate}</td></tr>` : ''}
        </table>
        ${inquiry.message ? `<p><strong>Message:</strong></p><p style="background:#f5f5f5;padding:15px;border-radius:4px">${inquiry.message}</p>` : ''}
      `);
    } else if (data.type === 'helicopter-inquiry') {
      title = 'New Helicopter Inquiry';
      subject = `New Helicopter Inquiry from ${data.fullName}`;
      html = generateAdminEmailHtml(title, `
        <h2>New Helicopter Service Inquiry</h2>
        <table style="width:100%;border-collapse:collapse;margin:10px 0">
          <tr><td style="padding:8px;border-bottom:1px solid #ddd"><strong>Full Name:</strong></td><td style="padding:8px;border-bottom:1px solid #ddd">${data.fullName}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #ddd"><strong>Email:</strong></td><td style="padding:8px;border-bottom:1px solid #ddd">${data.email}</td></tr>
          ${data.phone ? `<tr><td style="padding:8px;border-bottom:1px solid #ddd"><strong>Phone:</strong></td><td style="padding:8px;border-bottom:1px solid #ddd">${data.phone}</td></tr>` : ''}
          ${data.country ? `<tr><td style="padding:8px;border-bottom:1px solid #ddd"><strong>Country:</strong></td><td style="padding:8px;border-bottom:1px solid #ddd">${data.country}</td></tr>` : ''}
        </table>
        ${data.message ? `<p><strong>Message:</strong></p><p style="background:#f5f5f5;padding:15px;border-radius:4px">${data.message}</p>` : ''}
      `);
    } else if (data.inquiry) {
      const inquiry = data.inquiry;
      title = 'New Flight Inquiry';
      subject = `New Flight Inquiry from ${inquiry.customer_name || inquiry.name}`;
      html = generateAdminEmailHtml(title, `
        <h2>New Flight Inquiry Received</h2>
        <table style="width:100%;border-collapse:collapse;margin:10px 0">
          <tr><td style="padding:8px;border-bottom:1px solid #ddd"><strong>Name:</strong></td><td style="padding:8px;border-bottom:1px solid #ddd">${inquiry.customer_name || inquiry.name}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #ddd"><strong>Email:</strong></td><td style="padding:8px;border-bottom:1px solid #ddd">${inquiry.customer_email || inquiry.email}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #ddd"><strong>Phone:</strong></td><td style="padding:8px;border-bottom:1px solid #ddd">${inquiry.customer_phone || inquiry.phone || 'N/A'}</td></tr>
          ${inquiry.trip_type ? `<tr><td style="padding:8px;border-bottom:1px solid #ddd"><strong>Trip Type:</strong></td><td style="padding:8px;border-bottom:1px solid #ddd">${inquiry.trip_type}</td></tr>` : ''}
          ${inquiry.aircraft_type ? `<tr><td style="padding:8px;border-bottom:1px solid #ddd"><strong>Aircraft Type:</strong></td><td style="padding:8px;border-bottom:1px solid #ddd">${inquiry.aircraft_type}</td></tr>` : ''}
          ${inquiry.passenger_count ? `<tr><td style="padding:8px;border-bottom:1px solid #ddd"><strong>Passengers:</strong></td><td style="padding:8px;border-bottom:1px solid #ddd">${inquiry.passenger_count}</td></tr>` : ''}
        </table>
        ${inquiry.message ? `<p><strong>Message:</strong></p><p style="background:#f5f5f5;padding:15px;border-radius:4px">${inquiry.message}</p>` : ''}
      `);
    }
    
    if (!html) {
      console.log('No email template generated for admin notification');
      return;
    }
    
    const mailOptions = {
      from: `Skyriting <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject,
      html,
      replyTo: data.inquiry?.email || data.inquiry?.customer_email || data.application?.email || data.email,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Admin notification sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending admin notification:', error);
    // Don't throw - admin notification failure shouldn't break user flow
  }
}

/**
 * Generate consistent admin email HTML
 */
function generateAdminEmailHtml(title, contentHtml) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Helvetica', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
        .header { background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); color: white; padding: 25px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 300; letter-spacing: 3px; }
        .header p { margin: 5px 0 0 0; font-size: 12px; color: rgba(255,255,255,0.6); letter-spacing: 2px; }
        .badge { display: inline-block; background: #ce3631; color: white; padding: 4px 12px; border-radius: 20px; font-size: 11px; letter-spacing: 1px; margin: 10px 0 0 0; }
        .content { padding: 30px; }
        .content h2 { color: #000; font-weight: 400; font-size: 18px; border-bottom: 2px solid #ce3631; padding-bottom: 10px; }
        .footer { background: #f9f9f9; padding: 15px 20px; text-align: center; color: #999; font-size: 11px; border-top: 1px solid #e0e0e0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>SKYRITING</h1>
          <p>PREMIUM PRIVATE AVIATION</p>
          <div class="badge">${title.toUpperCase()}</div>
        </div>
        <div class="content">
          ${contentHtml}
          <p style="margin-top:20px;color:#999;font-size:12px">Received on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Skyriting. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Send email verification email
 */
export async function sendVerificationEmail(user, verificationToken) {
  try {
    const transporter = createTransporter();
    const html = getVerificationEmailTemplate(user, verificationToken);
    
    const mailOptions = {
      from: `Skyriting <${FROM_EMAIL}>`,
      to: user.email,
      subject: 'Verify Your Skyriting Account',
      html,
      replyTo: FROM_EMAIL,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(user, resetToken) {
  try {
    const transporter = createTransporter();
    const html = getPasswordResetEmailTemplate(user, resetToken);
    
    const mailOptions = {
      from: `Skyriting <${FROM_EMAIL}>`,
      to: user.email,
      subject: 'Reset Your Skyriting Password',
      html,
      replyTo: FROM_EMAIL,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
}
