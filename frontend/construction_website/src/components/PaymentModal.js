import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import '../styles/PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, bookingDetails }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update booking payment status
      const response = await axios.patch(`http://127.0.0.1:8000/api/bookings/${bookingDetails.bookingId}/`, {
        payment_status: 'COMPLETED'
      });

      if (response.data) {
        alert('Payment successful! Your booking is confirmed.');
        onClose();
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal-backdrop" onClick={onClose} />
      <div className="payment-modal-container">
        <button onClick={onClose} className="close-button">
          <X className="close-icon" />
        </button>

        <div className="payment-header">
          <h2>Complete Your Payment</h2>
          <div className="booking-summary">
            <p><strong>Service:</strong> {bookingDetails.serviceName}</p>
            <p><strong>Amount:</strong> ₹{bookingDetails.amount}</p>
          </div>
        </div>

        <div className="payment-methods">
          <button
            className={`method-button ${paymentMethod === 'card' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('card')}
          >
            Credit/Debit Card
          </button>
          <button
            className={`method-button ${paymentMethod === 'upi' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('upi')}
          >
            UPI
          </button>
        </div>

        {paymentMethod === 'card' ? (
          <form onSubmit={handleSubmit} className="payment-form">
            <div className="form-group">
              <label>Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={cardDetails.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={cardDetails.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  maxLength="5"
                  required
                />
              </div>

              <div className="form-group">
                <label>CVV</label>
                <input
                  type="password"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  maxLength="3"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Cardholder Name</label>
              <input
                type="text"
                name="name"
                value={cardDetails.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
              />
            </div>

            <button 
              type="submit" 
              className="pay-button"
              disabled={loading}
            >
              {loading ? 'Processing...' : `Pay ₹${bookingDetails.amount}`}
            </button>
          </form>
        ) : (
          <div className="upi-section">
            <div className="qr-code-placeholder">
              <p>Scan QR Code to Pay</p>
              {/* Add QR code image here */}
            </div>
            <p className="upi-id">UPI ID: your.business@upi</p>
            <button 
              className="pay-button"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'I have made the payment'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
