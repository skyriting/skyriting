// Email templates with Skyriting branding and her_o.png logo

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const LOGO_URL = `${FRONTEND_URL}/images/her_o.png`;

/**
 * Get email verification template
 */
export function getVerificationEmailTemplate(user, verificationToken) {
  const verificationLink = `${FRONTEND_URL}/verify-email/${verificationToken}`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { 
          font-family: 'Helvetica', Arial, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          margin: 0; 
          padding: 0; 
          background-color: #f4f4f4;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: #ffffff;
        }
        .header { 
          background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); 
          color: white; 
          padding: 30px 20px; 
          text-align: center; 
        }
        .logo-container {
          margin-bottom: 20px;
        }
        .logo-container img {
          max-width: 200px;
          height: auto;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 300;
          letter-spacing: 2px;
        }
        .content { 
          padding: 40px 30px; 
          background: #ffffff;
        }
        .button { 
          display: inline-block; 
          padding: 15px 40px; 
          background: #ce3631; 
          color: white; 
          text-decoration: none; 
          border-radius: 4px; 
          margin: 20px 0;
          font-weight: 500;
          letter-spacing: 1px;
        }
        .button:hover { 
          background: #a02a26; 
        }
        .footer { 
          background: #f9f9f9; 
          padding: 20px; 
          text-align: center; 
          color: #666; 
          font-size: 12px;
          border-top: 1px solid #e0e0e0;
        }
        .text-center { text-align: center; }
        .mt-20 { margin-top: 20px; }
        .mb-20 { margin-bottom: 20px; }
        p { margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo-container">
            <img src="${LOGO_URL}" alt="Skyriting Logo" />
          </div>
          <h1>ELEVATE YOUR JOURNEY</h1>
        </div>
        <div class="content">
          <h2 style="color: #000; font-weight: 300; letter-spacing: 1px;">Welcome to Skyriting, ${user.name}!</h2>
          <p>Thank you for registering with Skyriting. To complete your registration and start booking premium private aviation services, please verify your email address.</p>
          <p>Click the button below to verify your email:</p>
          <div class="text-center">
            <a href="${verificationLink}" class="button">Verify Email Address</a>
          </div>
          <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
          <p style="color: #ce3631; font-size: 12px; word-break: break-all;">${verificationLink}</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">This verification link will expire in 24 hours.</p>
          <p style="color: #666; font-size: 12px;">If you didn't create an account with Skyriting, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Skyriting. All rights reserved.</p>
          <p>Premium Private Aviation Platform</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Get password reset email template
 */
export function getPasswordResetEmailTemplate(user, resetToken) {
  const resetLink = `${FRONTEND_URL}/reset-password/${resetToken}`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { 
          font-family: 'Helvetica', Arial, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          margin: 0; 
          padding: 0; 
          background-color: #f4f4f4;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: #ffffff;
        }
        .header { 
          background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); 
          color: white; 
          padding: 30px 20px; 
          text-align: center; 
        }
        .logo-container {
          margin-bottom: 20px;
        }
        .logo-container img {
          max-width: 200px;
          height: auto;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 300;
          letter-spacing: 2px;
        }
        .content { 
          padding: 40px 30px; 
          background: #ffffff;
        }
        .button { 
          display: inline-block; 
          padding: 15px 40px; 
          background: #ce3631; 
          color: white; 
          text-decoration: none; 
          border-radius: 4px; 
          margin: 20px 0;
          font-weight: 500;
          letter-spacing: 1px;
        }
        .button:hover { 
          background: #a02a26; 
        }
        .footer { 
          background: #f9f9f9; 
          padding: 20px; 
          text-align: center; 
          color: #666; 
          font-size: 12px;
          border-top: 1px solid #e0e0e0;
        }
        .text-center { text-align: center; }
        .warning {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
        }
        p { margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo-container">
            <img src="${LOGO_URL}" alt="Skyriting Logo" />
          </div>
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <h2 style="color: #000; font-weight: 300; letter-spacing: 1px;">Hello ${user.name},</h2>
          <p>We received a request to reset your password for your Skyriting account.</p>
          <p>Click the button below to reset your password:</p>
          <div class="text-center">
            <a href="${resetLink}" class="button">Reset Password</a>
          </div>
          <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
          <p style="color: #ce3631; font-size: 12px; word-break: break-all;">${resetLink}</p>
          <div class="warning">
            <p style="margin: 0; color: #856404;"><strong>Security Notice:</strong></p>
            <p style="margin: 5px 0 0 0; color: #856404; font-size: 12px;">This link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
          </div>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Skyriting. All rights reserved.</p>
          <p>Premium Private Aviation Platform</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Get quote email template (existing, but with logo)
 */
export async function getQuoteEmailTemplate(quote) {
  // This function already exists, we'll enhance it
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #000; color: white; padding: 20px; text-align: center; }
        .logo-container img { max-width: 200px; height: auto; }
        .content { padding: 20px; background: #f9f9f9; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        td { padding: 8px; border-bottom: 1px solid #ddd; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo-container">
            <img src="${LOGO_URL}" alt="Skyriting Logo" />
          </div>
          <h1>Your Skyriting Quote</h1>
        </div>
        <div class="content">
          <h2>Quote Details</h2>
          <p>Quote Number: ${quote.quoteNumber || quote._id}</p>
          <!-- Add more quote details here -->
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Get booking confirmation template with full details
 */
export async function getBookingConfirmationTemplate(booking) {
  const bookingDate = booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : new Date().toLocaleDateString();
  const legs = booking.flightDetails?.legs || [];
  
  let legsHtml = '';
  if (legs.length > 0) {
    legsHtml = legs.map((leg, idx) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">Leg ${idx + 1}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${leg.origin} → ${leg.destination}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${new Date(leg.departureDate).toLocaleDateString()} ${leg.departureTime || ''}</td>
      </tr>
    `).join('');
  }
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #000; color: white; padding: 20px; text-align: center; }
        .logo-container img { max-width: 200px; height: auto; }
        .content { padding: 20px; background: #f9f9f9; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo-container">
            <img src="${LOGO_URL}" alt="Skyriting Logo" />
          </div>
          <h1>Booking Confirmation</h1>
        </div>
        <div class="content">
          <h2>Your booking has been confirmed!</h2>
          <p><strong>Booking Number:</strong> ${booking.bookingNumber || booking._id}</p>
          <p><strong>Booking Date:</strong> ${bookingDate}</p>
          <p><strong>Status:</strong> ${booking.status || 'Confirmed'}</p>
          
          ${booking.aircraftId ? `
            <h3 style="margin-top: 20px;">Aircraft Details</h3>
            <p><strong>Aircraft:</strong> ${booking.aircraftId.name || 'N/A'}</p>
            ${booking.aircraftId.tailNumber ? `<p><strong>Tail Number:</strong> ${booking.aircraftId.tailNumber}</p>` : ''}
          ` : ''}
          
          ${legs.length > 0 ? `
            <h3 style="margin-top: 20px;">Flight Details</h3>
            <p><strong>Trip Type:</strong> ${booking.flightDetails?.tripType || 'N/A'}</p>
            <p><strong>Passengers:</strong> ${booking.flightDetails?.passengerCount || 1}</p>
            <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
              <thead>
                <tr style="background: #f0f0f0;">
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Leg</th>
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Route</th>
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Departure</th>
                </tr>
              </thead>
              <tbody>
                ${legsHtml}
              </tbody>
            </table>
          ` : ''}
          
          ${booking.totalAmount ? `
            <h3 style="margin-top: 20px;">Pricing</h3>
            <p><strong>Total Amount:</strong> ${booking.currency || 'USD'} ${booking.totalAmount.toLocaleString()}</p>
            <p><strong>Payment Status:</strong> ${booking.paymentStatus || 'Pending'}</p>
          ` : ''}
          
          ${booking.contactInfo ? `
            <h3 style="margin-top: 20px;">Contact Information</h3>
            <p><strong>Name:</strong> ${booking.contactInfo.name}</p>
            <p><strong>Email:</strong> ${booking.contactInfo.email}</p>
            <p><strong>Phone:</strong> ${booking.contactInfo.phone}</p>
          ` : ''}
          
          ${booking.specialRequests ? `
            <h3 style="margin-top: 20px;">Special Requests</h3>
            <p>${booking.specialRequests}</p>
          ` : ''}
          
          <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            Thank you for choosing Skyriting. We look forward to serving you!
          </p>
          <p style="margin-top: 10px;">
            If you have any questions, please contact us at <a href="mailto:info@skyriting.com">info@skyriting.com</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
