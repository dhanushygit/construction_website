import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Signup.css'; // Ensure this path is correct

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/api/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Signup successful! You can now log in.');

        // Redirect to login page after successful signup
        setTimeout(() => {
          navigate('/');
        }, 2000);

        setUsername('');
        setEmail('');
        setPassword('');
      } else {
        setMessage(data.message || 'Signup failed');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  const redirectToLogin = () => {
    navigate('/');
  };

  return (
    <div className='sbody'>
    <div className="signup-container">
      <h1 className="signup-header">Signup</h1>
      <form onSubmit={handleSignup}>
        <div className="form-group">
          <label className="form-label">Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <button type="submit" className="form-button">
          Signup
        </button>
      </form>
      <h3 className="form-label">
        Already have an account?{' '}
        <span className="form-link" onClick={redirectToLogin}>
          Login
        </span>
      </h3>
      {message && (
        <p
          className="message"
          style={{ color: message.includes('successful') ? 'green' : 'red' }}
        >
          {message}
        </p>
      )}
    </div>
    </div>
  );
};

export default Signup;
