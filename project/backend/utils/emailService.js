import nodemailer from 'nodemailer';
import { getQuoteEmailTemplate, getBookingConfirmationTemplate, getVerificationEmailTemplate, getPasswordResetEmailTemplate } from './emailTemplates.js';

// Create Gmail transporter using OAuth2
const createTransporter = () => {
  const user = process.env.GMAIL_USER || 'team@eco-dispose.com';
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    console.warn('Gmail OAuth2 credentials not fully configured. Email sending may fail.');
  }

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
};

/**
 * Send quote email with Skyriting branding
 */
export async function sendQuoteEmail(quote, recipientEmail) {
  try {
    const transporter = createTransporter();
    
    const html = await getQuoteEmailTemplate(quote);
    
    const mailOptions = {
      from: `Skyriting <${process.env.GMAIL_USER || 'team@eco-dispose.com'}>`,
      to: recipientEmail,
      subject: `Your Skyriting Quote - ${quote.quoteNumber}`,
      html,
      replyTo: process.env.GMAIL_USER || 'team@eco-dispose.com',
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
      from: `Skyriting <${process.env.GMAIL_USER || 'team@eco-dispose.com'}>`,
      to: booking.contactInfo.email,
      subject: `Booking Confirmation - ${booking.bookingNumber}`,
      html,
      replyTo: process.env.GMAIL_USER || 'team@eco-dispose.com',
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
      from: `Skyriting <${process.env.GMAIL_USER || 'team@eco-dispose.com'}>`,
      to: booking.contactInfo.email,
      subject: `Reschedule ${rescheduleRequest.status === 'approved' ? 'Approved' : 'Rejected'} - ${booking.bookingNumber}`,
      html,
      replyTo: process.env.GMAIL_USER || 'team@eco-dispose.com',
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
      html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            td { padding: 8px; border-bottom: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${title} - Skyriting</h1>
            </div>
            <div class="content">
              <h2>New Contact Inquiry Received</h2>
              <table>
                <tr><td><strong>Name:</strong></td><td>${inquiry.name}</td></tr>
                <tr><td><strong>Email:</strong></td><td>${inquiry.email}</td></tr>
                ${inquiry.phone ? `<tr><td><strong>Phone:</strong></td><td>${inquiry.phone}</td></tr>` : ''}
                <tr><td><strong>Subject:</strong></td><td>${inquiry.subject}</td></tr>
              </table>
              <p><strong>Message:</strong></p>
              <p>${inquiry.message}</p>
              <p><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/contact/${inquiry._id || inquiry.id}">View Inquiry</a></p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (data.type === 'career' && data.application) {
      const app = data.application;
      title = 'New Career Application';
      subject = `New Career Application from ${app.name} - ${app.position}`;
      html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            td { padding: 8px; border-bottom: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${title} - Skyriting</h1>
            </div>
            <div class="content">
              <h2>New Career Application Received</h2>
              <table>
                <tr><td><strong>Name:</strong></td><td>${app.name}</td></tr>
                <tr><td><strong>Email:</strong></td><td>${app.email}</td></tr>
                <tr><td><strong>Phone:</strong></td><td>${app.phone}</td></tr>
                <tr><td><strong>Position:</strong></td><td>${app.position}</td></tr>
                <tr><td><strong>Experience:</strong></td><td>${app.experience}</td></tr>
                ${app.resume ? `<tr><td><strong>Resume:</strong></td><td><a href="${app.resume}">View Resume</a></td></tr>` : ''}
              </table>
              ${app.coverLetter ? `<p><strong>Cover Letter:</strong></p><p>${app.coverLetter}</p>` : ''}
              <p><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/career/${app._id || app.id}">View Application</a></p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (data.type === 'service' && data.inquiry) {
      const inquiry = data.inquiry;
      title = 'New Service Inquiry';
      subject = `New Service Inquiry: ${inquiry.serviceName} from ${inquiry.name}`;
      html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            td { padding: 8px; border-bottom: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${title} - Skyriting</h1>
            </div>
            <div class="content">
              <h2>New Service Inquiry Received</h2>
              <table>
                <tr><td><strong>Service:</strong></td><td>${inquiry.serviceName}</td></tr>
                <tr><td><strong>Name:</strong></td><td>${inquiry.name}</td></tr>
                <tr><td><strong>Email:</strong></td><td>${inquiry.email}</td></tr>
                ${inquiry.phone ? `<tr><td><strong>Phone:</strong></td><td>${inquiry.phone}</td></tr>` : ''}
                ${inquiry.company ? `<tr><td><strong>Company:</strong></td><td>${inquiry.company}</td></tr>` : ''}
                <tr><td><strong>Subject:</strong></td><td>${inquiry.subject}</td></tr>
              </table>
              <p><strong>Message:</strong></p>
              <p>${inquiry.message}</p>
              <p><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/service-inquiry/${inquiry._id || inquiry.id}">View Inquiry</a></p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (data.type === 'package' && data.inquiry) {
      const inquiry = data.inquiry;
      title = 'New Package Inquiry';
      subject = `New Package Inquiry: ${inquiry.packageName} from ${inquiry.name}`;
      html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            td { padding: 8px; border-bottom: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${title} - Skyriting</h1>
            </div>
            <div class="content">
              <h2>New Package Inquiry Received</h2>
              <table>
                <tr><td><strong>Package:</strong></td><td>${inquiry.packageName}</td></tr>
                <tr><td><strong>Name:</strong></td><td>${inquiry.name}</td></tr>
                <tr><td><strong>Email:</strong></td><td>${inquiry.email}</td></tr>
                <tr><td><strong>Phone:</strong></td><td>${inquiry.phone}</td></tr>
                ${inquiry.selectedPackageType ? `<tr><td><strong>Package Type:</strong></td><td>${inquiry.selectedPackageType}</td></tr>` : ''}
                ${inquiry.selectedPackage ? `<tr><td><strong>Selected Package:</strong></td><td>${inquiry.selectedPackage}</td></tr>` : ''}
                ${inquiry.selectedDate ? `<tr><td><strong>Selected Date:</strong></td><td>${inquiry.selectedDate}</td></tr>` : ''}
              </table>
              ${inquiry.message ? `<p><strong>Message:</strong></p><p>${inquiry.message}</p>` : ''}
              <p><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/package-inquiry/${inquiry._id || inquiry.id}">View Inquiry</a></p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (data.type === 'helicopter-inquiry') {
      title = 'New Helicopter Inquiry';
      subject = `New Helicopter Inquiry from ${data.fullName}`;
      html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            td { padding: 8px; border-bottom: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${title} - Skyriting</h1>
            </div>
            <div class="content">
              <h2>New Helicopter Service Inquiry</h2>
              <p><strong>Helicopter Service Available Around the Clock</strong></p>
              <p>Skyriting helicopters have a proven track record of over 10,000 flying hours, showcasing our commitment to safety and reliability in every journey we undertake.</p>
              <table>
                <tr><td><strong>Full Name:</strong></td><td>${data.fullName}</td></tr>
                <tr><td><strong>Email:</strong></td><td>${data.email}</td></tr>
                ${data.phone ? `<tr><td><strong>Phone:</strong></td><td>${data.phone}</td></tr>` : ''}
                ${data.country ? `<tr><td><strong>Country:</strong></td><td>${data.country}</td></tr>` : ''}
              </table>
              ${data.message ? `<p><strong>Message:</strong></p><p>${data.message}</p>` : ''}
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (data.inquiry) {
      // Legacy inquiry format
      const inquiry = data.inquiry;
      title = 'New Inquiry';
      subject = `New Inquiry from ${inquiry.customer_name || inquiry.name}`;
      html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            td { padding: 8px; border-bottom: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${title} - Skyriting</h1>
            </div>
            <div class="content">
              <h2>New Inquiry Received</h2>
              <table>
                <tr><td><strong>Name:</strong></td><td>${inquiry.customer_name || inquiry.name}</td></tr>
                <tr><td><strong>Email:</strong></td><td>${inquiry.customer_email || inquiry.email}</td></tr>
                <tr><td><strong>Phone:</strong></td><td>${inquiry.customer_phone || inquiry.phone || 'N/A'}</td></tr>
                ${inquiry.trip_type ? `<tr><td><strong>Trip Type:</strong></td><td>${inquiry.trip_type}</td></tr>` : ''}
                ${inquiry.aircraft_type ? `<tr><td><strong>Aircraft Type:</strong></td><td>${inquiry.aircraft_type}</td></tr>` : ''}
                ${inquiry.passenger_count ? `<tr><td><strong>Passengers:</strong></td><td>${inquiry.passenger_count}</td></tr>` : ''}
              </table>
              ${inquiry.message ? `<p><strong>Message:</strong> ${inquiry.message}</p>` : ''}
              <p><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/inquiries/${inquiry._id || inquiry.id}">View Inquiry</a></p>
            </div>
          </div>
        </body>
        </html>
      `;
    }
    
    const mailOptions = {
      from: `Skyriting <${process.env.GMAIL_USER || 'team@eco-dispose.com'}>`,
      to: process.env.ADMIN_EMAIL || process.env.GMAIL_USER || 'team@eco-dispose.com',
      subject,
      html,
      replyTo: data.inquiry?.email || data.inquiry?.customer_email || data.application?.email || data.email,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Admin notification sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending admin notification:', error);
    throw error;
  }
}

/**
 * Send email verification email
 */
export async function sendVerificationEmail(user, verificationToken) {
  try {
    const transporter = createTransporter();
    const html = getVerificationEmailTemplate(user, verificationToken);
    
    const mailOptions = {
      from: `Skyriting <${process.env.GMAIL_USER || 'team@eco-dispose.com'}>`,
      to: user.email,
      subject: 'Verify Your Skyriting Account',
      html,
      replyTo: process.env.GMAIL_USER || 'team@eco-dispose.com',
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
      from: `Skyriting <${process.env.GMAIL_USER || 'team@eco-dispose.com'}>`,
      to: user.email,
      subject: 'Reset Your Skyriting Password',
      html,
      replyTo: process.env.GMAIL_USER || 'team@eco-dispose.com',
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
}
