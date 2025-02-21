import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isAdmin) {
        const response = await axios.post('http://127.0.0.1:8000/api/admin/login/', {
          username: formData.username,
          password: formData.password
        });

        if (response.data.status === 'success') {
          localStorage.setItem('isAdmin', 'true');
          localStorage.setItem('username', response.data.user.username);
          localStorage.setItem('userRole', 'admin');
          localStorage.setItem('token', response.data.token || 'admin-token');
          setFormData({ username: '', password: '' });
          setError('');
          navigate('/admin-dashboard');
        }
      } else {
        const response = await axios.post('http://127.0.0.1:8000/api/login/', formData);
        if (response.data.message === 'Login successful') {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('username', formData.username);
          localStorage.setItem('userRole', 'user');
          setFormData({ username: '', password: '' });
          navigate('/home');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'Invalid credentials. Please try again.');
      } else {
        setError('An error occurred during login. Please try again.');
      }
      setFormData(prev => ({ ...prev, password: '' }));
    }
  };

  const toggleAdminLogin = () => {
    setIsAdmin(!isAdmin);
    setFormData({ username: '', password: '' });
    setError('');
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>{isAdmin ? 'Admin Login' : 'User Login'}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder={isAdmin ? "Enter admin username" : "Enter username"}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder={isAdmin ? "Enter admin password" : "Enter password"}
              required
            />
          </div>
          <button type="submit" className="login-button">
            {isAdmin ? 'Login as Admin' : 'Login'}
          </button>
        </form>
        <div className="login-options">
          <button 
            onClick={toggleAdminLogin} 
            className="switch-login-type"
            aria-label={`Switch to ${isAdmin ? 'User' : 'Admin'} Login`}
          >
            Switch to {isAdmin ? 'User' : 'Admin'} Login
          </button>
          {!isAdmin && (
            <>
              <Link to="/signup" className="signup-link">
                Don't have an account? Sign up
              </Link>
              <Link to="/forgot-password" className="forgot-password-link">
                Forgot Password?
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
