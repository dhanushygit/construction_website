import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Forgot.css';

const Forgot = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/password-reset/', {
        email,
      });

      if (response.status === 200) {
        setMessage('Password reset instructions have been sent to your email.');
      } else {
        setMessage('Email not found.');
      }
    } catch (err) {
      setMessage('An error occurred. Please try again.');
      console.error('Forgot password error:', err);
    }
  };

  return (
    <div className="forgot-password-container">
      <form onSubmit={handleSubmit} className="forgot-password-form">
        <h2>Forgot Password</h2>
        {message && <p className="message">{message}</p>}
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="forgot-password-button">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default Forgot;
