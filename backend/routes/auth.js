import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { sendOtpEmail } from '../services/emailService.js'

const router = express.Router()

// DNS/Health Check for auth routes
router.get('/ping', (req, res) => {
  res.json({ message: 'Auth routes are active', timestamp: new Date() })
})

// Test Email Endpoint
router.get('/test-email', async (req, res) => {
  try {
    console.log('[TEST] Attempting to send test email...');
    const result = await sendOtpEmail(process.env.TEST_EMAIL || 'test@example.com', '123456');
    console.log('[TEST] Email sent successfully:', result);
    res.json({
      success: true,
      message: 'Test email sent successfully',
      previewUrl: result.previewUrl
    });
  } catch (error) {
    console.error('[TEST] Email test failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
})

// Register
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, department, batch, location, linkedin, skills, achievements, about } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const normalizedEmail = email.toLowerCase().trim()
    const existingUser = await User.findOne({ email: normalizedEmail })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const user = new User({
      firstName,
      lastName,
      email: normalizedEmail,
      password,
      department,
      batch,
      location,
      linkedin,
      skills,
      achievements,
      about,
    })

    await user.save()

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim()
    const user = await User.findOne({ email: normalizedEmail })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Forgot Password - Send OTP
router.post('/forgot-password', async (req, res) => {
  console.log(`[AUTH] Forgot password requested for: ${req.body.email}`)
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: 'Email is required' })
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })

    if (!user) {
      // Don't reveal that the email doesn't exist for security reasons
      console.log(`[AUTH] Password reset requested for non-existent email: ${email}`)
      return res.json({ message: 'If an account with this email exists, you will receive an OTP' })
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    user.otp = otp
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes expiry

    await user.save()
    console.log(`[OTP] Generated OTP for ${email}`)

    try {
      const result = await sendOtpEmail(email, otp);
      console.log(`[EMAIL] OTP sent successfully to ${email}`, {
        messageId: result.messageId,
        previewUrl: result.previewUrl
      });
      return res.json({
        success: true,
        message: 'OTP sent successfully to your email',
        previewUrl: result.previewUrl // Only in development
      });
    } catch (emailError) {
      console.error('Failed to send OTP email:', {
        error: emailError.message,
        stack: emailError.stack,
        email: email
      });
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP. Please try again later.',
        ...(process.env.NODE_ENV === 'development' && { error: emailError.message })
      });
    }
  } catch (error) {
    console.error('Forgot Password Error:', {
      error: error.message,
      stack: error.stack,
      email: req.body.email
    });
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
})

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      otp,
      otpExpiry: { $gt: new Date() }
    });

    if (!user) {
      console.log(`[AUTH] Invalid OTP attempt for email: ${email}`);
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP. Please request a new one.'
      });
    }

    // Generate a temporary token for password reset
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '15m' }
    );

    res.json({
      success: true,
      message: 'OTP verified successfully',
      resetToken
    });
  } catch (error) {
    console.error('OTP Verification Error:', {
      error: error.message,
      stack: error.stack,
      email: req.body.email
    });
    res.status(500).json({
      success: false,
      message: 'An error occurred while verifying OTP',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
})

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Reset token and new password are required'
      });
    }

    // Verify the reset token
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      userId = decoded.userId;
    } catch (jwtError) {
      console.error('JWT Verification Error:', jwtError);
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired reset link. Please request a new password reset.'
      });
    }

    // Find user and update password
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update password and clear OTP fields
    user.password = newPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    console.log(`[AUTH] Password reset successful for user: ${user.email}`);

    res.json({
      success: true,
      message: 'Password has been reset successfully. You can now log in with your new password.'
    });
  } catch (error) {
    console.error('Password Reset Error:', {
      error: error.message,
      stack: error.stack,
      userId: req.body.userId
    });
    res.status(500).json({
      success: false,
      message: 'An error occurred while resetting your password',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
});

export default router
