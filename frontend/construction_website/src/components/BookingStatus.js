import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, X, Clock, CreditCard } from 'lucide-react';
import axios from 'axios';
import '../styles/BookingStatus.css';

const BookingStatus = () => {
  const [status, setStatus] = useState('PENDING');
  const [bookingDetails, setBookingDetails] = useState(null);
  const [isAdmin] = useState(localStorage.getItem('isAdmin') === 'true');
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId, workerName, serviceName } = location.state || {};

  useEffect(() => {
    if (!bookingId) {
      navigate('/services');
      return;
    }

    fetchBookingDetails();
  }, [bookingId, navigate]);

  const fetchBookingDetails = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/bookings/${bookingId}/`);
      setStatus(response.data.status);
      setBookingDetails(response.data);
    } catch (error) {
      console.error('Error fetching booking details:', error);
    }
  };

  const handleAdminAction = async (newStatus) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/bookings/${bookingId}/`, {
        status: newStatus
      });
      setStatus(newStatus);
      
      // Refresh booking details after status update
      fetchBookingDetails();
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status. Please try again.');
    }
  };

  const handlePayment = () => {
    navigate('/payment', {
      state: {
        bookingId,
        amount: bookingDetails.amount,
        serviceName
      }
    });
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'ACCEPTED':
        return <Check className="status-icon accepted" />;
      case 'REJECTED':
        return <X className="status-icon rejected" />;
      default:
        return <Clock className="status-icon pending" />;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'ACCEPTED':
        return `Your booking request has been accepted by ${workerName}. Please proceed with the payment.`;
      case 'REJECTED':
        return `Sorry, your booking request has been declined by ${workerName}. Please try booking with another service provider.`;
      default:
        return `Your booking request is pending approval from ${workerName}.`;
    }
  };

  if (!bookingId || !workerName) {
    return <div className="error">Invalid booking reference</div>;
  }

  return (
    <div className="booking-status-container">
      <div className="status-card">
        <div className="status-header">
          <h2>Booking Status</h2>
          {getStatusIcon()}
        </div>

        <div className="status-message">
          {getStatusMessage()}
        </div>

        <div className="booking-details">
          <h3>Booking Details</h3>
          <p><strong>Service:</strong> {serviceName}</p>
          <p><strong>Provider:</strong> {workerName}</p>
          {bookingDetails && (
            <>
              <p><strong>Date:</strong> {new Date(bookingDetails.booking_date).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {status}</p>
              {isAdmin && status === 'PENDING' && (
                <div className="admin-actions">
                  <button 
                    className="accept-btn"
                    onClick={() => handleAdminAction('ACCEPTED')}
                  >
                    Accept Booking
                  </button>
                  <button 
                    className="decline-btn"
                    onClick={() => handleAdminAction('REJECTED')}
                  >
                    Decline Booking
                  </button>
                </div>
              )}
              {!isAdmin && status === 'ACCEPTED' && (
                <button 
                  className="payment-btn"
                  onClick={handlePayment}
                >
                  <CreditCard className="payment-icon" />
                  Proceed to Payment
                </button>
              )}
            </>
          )}
        </div>

        <div className="booking-actions">
          <button 
            className="new-booking-btn"
            onClick={() => navigate('/services')}
          >
            Book Another Service
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingStatus;
