import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const LoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('whatsapp:+91');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:3000/api/auth/login', { phone_number: phoneNumber });
      setStep(2);
    } catch (err) {
      setError('Failed to send OTP. Please check the phone number.');
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:3000/api/auth/verify', { phone_number: phoneNumber, otp });
      login(response.data.token, response.data.user);
      navigate('/');
    } catch (err) {
      setError('Invalid or expired OTP. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="text-center">
          <h1 className="sidebar-header" style={{marginBottom: '10px'}}>GigCoach AI</h1>
          <p style={{marginTop: 0, color: '#6b7280'}}>
            {step === 1 ? 'Log in or sign up to continue' : 'Enter the code we sent to your console'}
          </p>
        </div>
        {step === 1 ? (
          <form onSubmit={handleRequestOtp}>
            <div className="form-group">
              <label htmlFor="phone_number">WhatsApp Number</label>
              <input id="phone_number" name="phone_number" type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
            </div>
            <div className="form-actions" style={{justifyContent: 'center'}}>
              <button type="submit" disabled={loading} className="btn-primary" style={{width: '100%'}}>
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
             <div className="form-group">
              <label htmlFor="otp">Enter 6-Digit OTP</label>
              <input id="otp" name="otp" type="text" maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value)} required />
            </div>
            <div className="form-actions" style={{justifyContent: 'center'}}>
              <button type="submit" disabled={loading} className="btn-primary" style={{width: '100%'}}>
                {loading ? 'Verifying...' : 'Log In'}
              </button>
            </div>
          </form>
        )}
        {error && <p style={{marginTop: '10px', textAlign: 'center', color: 'red'}}>{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;