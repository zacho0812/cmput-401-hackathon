 // backend/routes/notificationRoutes.js
import express from 'express';
import {
  isValidEmail,
  isValidPhoneNumber,
  sendEmail,
  sendSMS,
  sendApplicationNotification
} from '../services/notificationService.js';

const router = express.Router();

// Validate email endpoint
router.post('/validate/email', (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        valid: false,
        error: 'Email is required'
      });
    }

    const valid = isValidEmail(email);
    
    res.json({
      valid,
      email,
      message: valid ? 'Email is valid' : 'Email is invalid'
    });
  } catch (error) {
    res.status(500).json({
      valid: false,
      error: error.message
    });
  }
});

// Validate phone number endpoint
router.post('/validate/phone', (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({
        valid: false,
        error: 'Phone number is required'
      });
    }

    const valid = isValidPhoneNumber(phone);
    
    res.json({
      valid,
      phone,
      message: valid ? 'Phone number is valid' : 'Phone number is invalid'
    });
  } catch (error) {
    res.status(500).json({
      valid: false,
      error: error.message
    });
  }
});

// Send email endpoint
router.post('/send/email', async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;
    
    if (!to || !subject || !text) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: to, subject, text'
      });
    }

    const result = await sendEmail(to, subject, text, html);
    
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Send SMS endpoint
router.post('/send/sms', async (req, res) => {
  try {
    const { to, message } = req.body;
    
    if (!to || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: to, message'
      });
    }

    const result = await sendSMS(to, message);
    
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Send application notification (email + SMS)
router.post('/send/application-notification', async (req, res) => {
  try {
    const { email, phone, jobTitle, company, status } = req.body;
    
    if (!jobTitle || !company || !status) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: jobTitle, company, status'
      });
    }

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        error: 'At least one contact method (email or phone) is required'
      });
    }

    const results = await sendApplicationNotification(
      { email, phone },
      jobTitle,
      company,
      status
    );
    
    res.json({
      success: true,
      results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;