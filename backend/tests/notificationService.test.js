// backend/tests/notificationService.test.js
import {
    isValidEmail,
    isValidPhoneNumber,
    formatPhoneNumber,
    sendEmail,
    sendSMS
  } from '../services/notificationService.js';
  
  // Run all tests
  console.log('🧪 Running Notification Service Tests...\n');
  
  // Email validation tests
  console.log('📧 Testing Email Validation:');
  console.log('✓ test@example.com:', isValidEmail('test@example.com'));
  console.log('✓ user.name@company.co.uk:', isValidEmail('user.name@company.co.uk'));
  console.log('✓ first+last@domain.org:', isValidEmail('first+last@domain.org'));
  console.log('✗ notanemail:', isValidEmail('notanemail'));
  console.log('✗ @example.com:', isValidEmail('@example.com'));
  console.log('✗ user@:', isValidEmail('user@'));
  console.log('✗ empty string:', isValidEmail(''));
  
  console.log('\n📱 Testing Phone Validation:');
  console.log('✓ 1234567890:', isValidPhoneNumber('1234567890'));
  console.log('✓ (123) 456-7890:', isValidPhoneNumber('(123) 456-7890'));
  console.log('✓ 123-456-7890:', isValidPhoneNumber('123-456-7890'));
  console.log('✓ +1 123 456 7890:', isValidPhoneNumber('+1 123 456 7890'));
  console.log('✓ 11234567890:', isValidPhoneNumber('11234567890'));
  console.log('✗ 123:', isValidPhoneNumber('123'));
  console.log('✗ abcdefghij:', isValidPhoneNumber('abcdefghij'));
  console.log('✗ empty string:', isValidPhoneNumber(''));
  
  console.log('\n🔢 Testing Phone Formatting:');
  console.log('1234567890 →', formatPhoneNumber('1234567890'));
  console.log('(123) 456-7890 →', formatPhoneNumber('(123) 456-7890'));
  console.log('11234567890 →', formatPhoneNumber('11234567890'));
  
  console.log('\n📧 Testing Email Sending:');
  sendEmail('test@example.com', 'Test Subject', 'Test Body')
    .then(() => console.log('✓ Email test passed\n'))
    .catch(err => console.log('✗ Email test failed:', err.message));
  
  console.log('📱 Testing SMS Sending:');
  sendSMS('1234567890', 'Test message')
    .then(() => console.log('✓ SMS test passed\n'))
    .catch(err => console.log('✗ SMS test failed:', err.message));
  
  console.log('❌ Testing Invalid Cases:');
  sendEmail('notanemail', 'Subject', 'Body')
    .then(() => console.log('✗ Should have rejected invalid email'))
    .catch(() => console.log('✓ Correctly rejected invalid email'));
  
  sendSMS('123', 'Message')
    .then(() => console.log('✗ Should have rejected invalid phone'))
    .catch(() => console.log('✓ Correctly rejected invalid phone'));
  
  console.log('\n✅ All tests completed!\n');