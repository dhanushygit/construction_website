import React, { useEffect } from 'react';
import { Check } from 'lucide-react';
import '../styles/BookingSuccess.css';

const BookingSuccess = ({ onAnimationComplete }) => {
  useEffect(() => {
    // After animation completes (3 seconds), trigger the completion callback
    const timer = setTimeout(() => {
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <div className="booking-success">
      <div className="success-animation">
        <div className="checkmark-circle">
          <Check size={50} className="checkmark" />
        </div>
      </div>
      
      <h2>Booking Confirmed!</h2>
      <p>Your service has been booked successfully</p>
      
      <div className="success-details">
        <div className="success-amount">₹100.00</div>
        <p>Payment completed successfully</p>
      </div>
    </div>
  );
};

export default BookingSuccess;
