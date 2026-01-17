// backend/services/notificationService.js

// Email validation using regex
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Phone number validation (supports various formats)
  const isValidPhoneNumber = (phone) => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Check if it's 10 or 11 digits (with or without country code)
    if (cleaned.length === 10 || cleaned.length === 11) {
      return true;
    }
    
    return false;
  };
  
  // Format phone number for sending
  const formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    
    // If 10 digits, assume North America and add +1
    if (cleaned.length === 10) {
      return `+1${cleaned}`;
    }
    
    // If 11 digits and starts with 1, add +
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+${cleaned}`;
    }
    
    return `+${cleaned}`;
  };
  
  // Send email function (using nodemailer)
  const sendEmail = async (to, subject, text, html = null) => {
    // Validate email first
    if (!isValidEmail(to)) {
      throw new Error('Invalid email address');
    }
  
    // For development/hackathon: just log the email
    // In production, you'd use nodemailer with a real email service
    console.log('📧 EMAIL SENT:');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Body:', text);
    
    // Simulate sending email
    return {
      success: true,
      message: 'Email sent successfully',
      to,
      subject,
      timestamp: new Date().toISOString()
    };
    
    /* PRODUCTION CODE (uncomment when you have email credentials):
    import nodemailer from 'nodemailer';
    
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or your email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html: html || text
    };
  
    const info = await transporter.sendMail(mailOptions);
    return {
      success: true,
      message: 'Email sent successfully',
      messageId: info.messageId,
      to,
      subject
    };
    */
  };
  
  // Send SMS function (using Twilio)
  const sendSMS = async (to, message) => {
    // Validate phone number first
    if (!isValidPhoneNumber(to)) {
      throw new Error('Invalid phone number');
    }
  
    const formattedPhone = formatPhoneNumber(to);
  
    // For development/hackathon: just log the SMS
    console.log('📱 SMS SENT:');
    console.log('To:', formattedPhone);
    console.log('Message:', message);
    
    return {
      success: true,
      message: 'SMS sent successfully',
      to: formattedPhone,
      body: message,
      timestamp: new Date().toISOString()
    };
  
    /* PRODUCTION CODE (uncomment when you have Twilio credentials):
    import twilio from 'twilio';
    
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone
    });
  
    return {
      success: true,
      message: 'SMS sent successfully',
      sid: result.sid,
      to: formattedPhone,
      body: message
    };
    */
  };
  
  // Send application status notification (email + SMS)
  const sendApplicationNotification = async (contactInfo, jobTitle, company, status) => {
    const { email, phone } = contactInfo;
    
    const emailSubject = `Job Application Update: ${jobTitle} at ${company}`;
    const emailBody = `
      Your application status has been updated!
      
      Position: ${jobTitle}
      Company: ${company}
      Status: ${status}
      
      Date: ${new Date().toLocaleDateString()}
    `;
  
    const smsBody = `Job Update: Your application for ${jobTitle} at ${company} is now "${status}".`;
  
    const results = {};
  
    // Send email if provided
    if (email && isValidEmail(email)) {
      try {
        results.email = await sendEmail(email, emailSubject, emailBody);
      } catch (error) {
        results.email = { success: false, error: error.message };
      }
    }
  
    // Send SMS if provided
    if (phone && isValidPhoneNumber(phone)) {
      try {
        results.sms = await sendSMS(phone, smsBody);
      } catch (error) {
        results.sms = { success: false, error: error.message };
      }
    }
  
    return results;
  };
  
  export {
    isValidEmail,
    isValidPhoneNumber,
    formatPhoneNumber,
    sendEmail,
    sendSMS,
    sendApplicationNotification
  };