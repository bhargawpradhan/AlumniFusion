import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create email transporter
const createTransporter = async () => {
  try {
    console.log('[EMAIL] Initializing email service...');

    // Always use Gmail SMTP for now
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('Email credentials are not configured. Please set EMAIL_USER and EMAIL_PASS in .env');
    }

    console.log(`[EMAIL] Attempting to initialize Gmail SMTP with: ${process.env.EMAIL_USER}`);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false // Only for development
      }
    });

    // Verify connection configuration
    await transporter.verify();
    console.log('[EMAIL] Server is ready to take our messages');
    return transporter;
  } catch (error) {
    console.error('[EMAIL] Failed to create email transporter:', error);
    throw new Error(`Failed to initialize email service: ${error.message}`);
  }
};

// Create reusable transporter object
const transporterPromise = createTransporter();

transporterPromise.then(transporter => {
  transporter.verify(function (error, success) {
    if (error) {
      console.error('[EMAIL] Server connection error:', error);
    } else {
      console.log('[EMAIL] Server is ready to take our messages');
      if (process.env.NODE_ENV === 'development') {
        console.log('[EMAIL] Test account credentials:',
          `User: ${transporter.options.auth.user}, ` +
          `Pass: ${transporter.options.auth.pass}`);
      }
    }
  });
}).catch(console.error);

/**
 * Send OTP email to user
 * @param {string} to - Recipient email
 * @param {string} otp - The OTP to send
 * @returns {Promise<Object>} - Result of the email sending operation
 */
const sendOtpEmail = async (to, otp) => {
  try {
    const mailOptions = {
      from: `"AlumniFusion" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Your Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Password Reset Request</h2>
          <p>We received a request to reset your password. Please use the following OTP to proceed:</p>
          <div style="background: #f3f4f6; padding: 15px; text-align: center; margin: 20px 0; border-radius: 5px;">
            <h1 style="margin: 0; font-size: 32px; letter-spacing: 5px; color: #2563eb;">${otp}</h1>
          </div>
          <p>This OTP is valid for 10 minutes.</p>
          <p>If you didn't request this, please ignore this email or contact support if you have any concerns.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 14px;">This is an automated message, please do not reply directly to this email.</p>
        </div>
      `,
    };

    const transporter = await transporterPromise;
    const info = await transporter.sendMail(mailOptions);

    console.log(`[EMAIL] Message sent: ${info.messageId}`);
    // Preview URL for Ethereal Email
    if (process.env.NODE_ENV === 'development') {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    return {
      success: true,
      previewUrl: nodemailer.getTestMessageUrl(info)
    };
  } catch (error) {
    console.error('[EMAIL] Detailed error:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
      response: error.response,
      responseCode: error.responseCode,
      command: error.command
    });
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
};

export { sendOtpEmail };
