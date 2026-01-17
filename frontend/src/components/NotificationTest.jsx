// frontend/src/components/NotificationTest.jsx
import { useState } from 'react';

const NotificationTest = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [smsMessage, setSmsMessage] = useState('');
  const [results, setResults] = useState([]);

  const API_URL = 'http://localhost:3000/api/notifications';

  const addResult = (message, type = 'info') => {
    setResults(prev => [...prev, { message, type, timestamp: new Date().toISOString() }]);
  };

  const validateEmail = async () => {
    try {
      const response = await fetch(`${API_URL}/validate/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      
      addResult(
        `Email "${email}" is ${data.valid ? 'VALID ✓' : 'INVALID ✗'}`,
        data.valid ? 'success' : 'error'
      );
    } catch (error) {
      addResult(`Error: ${error.message}`, 'error');
    }
  };

  const validatePhone = async () => {
    try {
      const response = await fetch(`${API_URL}/validate/phone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const data = await response.json();
      
      addResult(
        `Phone "${phone}" is ${data.valid ? 'VALID ✓' : 'INVALID ✗'}`,
        data.valid ? 'success' : 'error'
      );
    } catch (error) {
      addResult(`Error: ${error.message}`, 'error');
    }
  };

  const sendEmailTest = async () => {
    try {
      const response = await fetch(`${API_URL}/send/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          subject: emailSubject,
          text: emailBody
        })
      });
      const data = await response.json();
      
      if (data.success) {
        addResult(`Email sent to ${email} ✓`, 'success');
      } else {
        addResult(`Failed to send email: ${data.error}`, 'error');
      }
    } catch (error) {
      addResult(`Error: ${error.message}`, 'error');
    }
  };

  const sendSMSTest = async () => {
    try {
      const response = await fetch(`${API_URL}/send/sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: phone,
          message: smsMessage
        })
      });
      const data = await response.json();
      
      if (data.success) {
        addResult(`SMS sent to ${phone} ✓`, 'success');
      } else {
        addResult(`Failed to send SMS: ${data.error}`, 'error');
      }
    } catch (error) {
      addResult(`Error: ${error.message}`, 'error');
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🔔 Notification System Test Panel</h1>
      
      {/* Email Validation Section */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2>📧 Email Validation</h2>
        <input
          type="text"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: '10px', width: '300px', marginRight: '10px' }}
        />
        <button onClick={validateEmail} style={{ padding: '10px 20px' }}>
          Validate Email
        </button>
      </div>

      {/* Phone Validation Section */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2>📱 Phone Number Validation</h2>
        <input
          type="text"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ padding: '10px', width: '300px', marginRight: '10px' }}
        />
        <button onClick={validatePhone} style={{ padding: '10px 20px' }}>
          Validate Phone
        </button>
      </div>

      {/* Send Email Section */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2>📧 Send Email</h2>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="To email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '10px', width: '100%', marginBottom: '10px' }}
          />
          <input
            type="text"
            placeholder="Subject"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
            style={{ padding: '10px', width: '100%', marginBottom: '10px' }}
          />
          <textarea
            placeholder="Email body"
            value={emailBody}
            onChange={(e) => setEmailBody(e.target.value)}
            style={{ padding: '10px', width: '100%', height: '100px' }}
          />
        </div>
        <button onClick={sendEmailTest} style={{ padding: '10px 20px' }}>
          Send Email
        </button>
      </div>

      {/* Send SMS Section */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2>📱 Send SMS</h2>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="To phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ padding: '10px', width: '100%', marginBottom: '10px' }}
          />
          <textarea
            placeholder="SMS message"
            value={smsMessage}
            onChange={(e) => setSmsMessage(e.target.value)}
            style={{ padding: '10px', width: '100%', height: '80px' }}
          />
        </div>
        <button onClick={sendSMSTest} style={{ padding: '10px 20px' }}>
          Send SMS
        </button>
      </div>

      {/* Results Section */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>📋 Test Results</h2>
          <button onClick={clearResults} style={{ padding: '5px 15px' }}>Clear</button>
        </div>
        <div style={{ maxHeight: '300px', overflowY: 'auto', marginTop: '10px' }}>
          {results.length === 0 ? (
            <p style={{ color: '#666' }}>No test results yet. Try the functions above!</p>
          ) : (
            results.map((result, index) => (
              <div
                key={index}
                style={{
                  padding: '10px',
                  marginBottom: '5px',
                  borderRadius: '4px',
                  backgroundColor: result.type === 'success' ? '#d4edda' : result.type === 'error' ? '#f8d7da' : '#d1ecf1',
                  color: result.type === 'success' ? '#155724' : result.type === 'error' ? '#721c24' : '#0c5460'
                }}
              >
                <small>{new Date(result.timestamp).toLocaleTimeString()}</small>
                <div>{result.message}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationTest;