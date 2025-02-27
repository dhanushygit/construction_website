import React, { useState } from 'react';
import { CreditCard, Calendar, Lock, X, AlertCircle } from 'lucide-react';
import '../styles/PaymentGateway.css';

// Fixed test credentials
const TEST_CREDENTIALS = {
  cardNumber: '4111 1111 1111 1111',
  expiryDate: '12/25',
  cvv: '123',
  name: 'TEST USER'
};

const PaymentGateway = ({ onPaymentComplete, onClose }) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTestCredentials, setShowTestCredentials] = useState(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    setError(''); // Clear error on input change

    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').match(/.{1,4}/g)?.join(' ') || '';
    }
    // Format expiry date
    if (name === 'expiryDate') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})/, '$1/')
        .substr(0, 5);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const validateCredentials = () => {
    // Remove spaces from card number for comparison
    const normalizedCardNumber = formData.cardNumber.replace(/\s/g, '');
    const testCardNumber = TEST_CREDENTIALS.cardNumber.replace(/\s/g, '');
    
    // Case insensitive name comparison
    const normalizedName = formData.name.trim().toUpperCase();
    const testName = TEST_CREDENTIALS.name.trim().toUpperCase();

    return (
      normalizedCardNumber === testCardNumber &&
      formData.expiryDate === TEST_CREDENTIALS.expiryDate &&
      formData.cvv === TEST_CREDENTIALS.cvv &&
      normalizedName === testName
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate payment processing
    setTimeout(() => {
      const isValid = validateCredentials();
      
      if (isValid) {
        setLoading(false);
        onPaymentComplete();
      } else {
        setLoading(false);
        setError('Invalid credentials. Please check your details or use the test credentials provided.');
        console.log('Entered:', {
          cardNumber: formData.cardNumber.replace(/\s/g, ''),
          expiryDate: formData.expiryDate,
          cvv: formData.cvv,
          name: formData.name.toUpperCase()
        });
        console.log('Expected:', {
          cardNumber: TEST_CREDENTIALS.cardNumber.replace(/\s/g, ''),
          expiryDate: TEST_CREDENTIALS.expiryDate,
          cvv: TEST_CREDENTIALS.cvv,
          name: TEST_CREDENTIALS.name
        });
      }
    }, 1500);
  };

  const handleUseTestCredentials = () => {
    setFormData({
      cardNumber: TEST_CREDENTIALS.cardNumber,
      expiryDate: TEST_CREDENTIALS.expiryDate,
      cvv: TEST_CREDENTIALS.cvv,
      name: TEST_CREDENTIALS.name
    });
    setShowTestCredentials(false);
    setError('');
  };

  return (
    <div className="payment-gateway">
      <button onClick={onClose} className="close-button">
        <X size={24} />
      </button>
      <div className="payment-container">
        <div className="payment-header">
          <h2>Complete Your Booking</h2>
          <div className="amount">₹100.00</div>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <div className="card-container">
          <div className={`card ${formData.cardNumber ? 'has-value' : ''}`}>
            <div className="card-header">
              <div className="chip"></div>
              <CreditCard className="card-type" size={24} />
            </div>
            <div className="card-number">
              {formData.cardNumber || '•••• •••• •••• ••••'}
            </div>
            <div className="card-details">
              <div className="card-holder">
                <span>Card Holder</span>
                <div>{formData.name || 'YOUR NAME'}</div>
              </div>
              <div className="card-expires">
                <span>Expires</span>
                <div>{formData.expiryDate || 'MM/YY'}</div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="payment-form">
          <div className="form-group">
            <label>
              <CreditCard className="label-icon" size={16} />
              Card Number
            </label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleInputChange}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                <Calendar className="label-icon" size={16} />
                Expiry Date
              </label>
              <input
                type="text"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                placeholder="MM/YY"
                maxLength="5"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <Lock className="label-icon" size={16} />
                CVV
              </label>
              <input
                type="password"
                name="cvv"
                value={formData.cvv}
                onChange={handleInputChange}
                placeholder="123"
                maxLength="3"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              <CreditCard className="label-icon" size={16} />
              Cardholder Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name as on card"
              required
            />
          </div>

          <button 
            type="submit" 
            className={`pay-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Pay ₹100.00'}
          </button>
        </form>

        <div className="payment-note">
          <button 
            className="test-credentials-button"
            onClick={() => setShowTestCredentials(!showTestCredentials)}
          >
            Show Test Credentials
          </button>
          {showTestCredentials && (
            <div className="test-credentials">
              <h4>Test Card Details:</h4>
              <p>Card Number: {TEST_CREDENTIALS.cardNumber}</p>
              <p>Expiry Date: {TEST_CREDENTIALS.expiryDate}</p>
              <p>CVV: {TEST_CREDENTIALS.cvv}</p>
              <p>Name: {TEST_CREDENTIALS.name}</p>
              <button 
                className="use-credentials-button"
                onClick={handleUseTestCredentials}
              >
                Use These Credentials
              </button>
            </div>
          )}
          <p className="secure-note">
            <Lock size={14} />
            <span>Your payment is secure and encrypted</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
