import React, { useState, useEffect, useRef } from 'react';
import { CircularProgress } from '@mui/material';
import axios from 'axios';
import '../styles/ApprovalTimer.css';

const ApprovalTimer = ({ bookingId, onApprovalComplete, onTimeout }) => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [status, setStatus] = useState('waiting');
  const timerRef = useRef(null);
  const pollRef = useRef(null);

  const clearAllIntervals = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (pollRef.current) clearInterval(pollRef.current);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearAllIntervals();
          onTimeout();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Poll for admin approval
    pollRef.current = setInterval(async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/bookings/${bookingId}/`);
        if (response.data.status === 'APPROVED') {
          clearAllIntervals();
          setTimeLeft(60); // Reset timer to show full circle
          setStatus('approved');
          // Show success message briefly before transitioning
          setTimeout(() => {
            onApprovalComplete();
          }, 1500);
        } else if (response.data.status === 'REJECTED') {
          clearAllIntervals();
          setStatus('rejected');
          onTimeout();
        }
      } catch (error) {
        console.error('Error checking booking status:', error);
      }
    }, 1000);

    return () => {
      clearAllIntervals();
    };
  }, [bookingId, onApprovalComplete, onTimeout]);

  // Prevent timer updates if status is approved or rejected
  const timerValue = status === 'approved' ? 100 : status === 'rejected' ? 0 : (timeLeft / 60) * 100;

  return (
    <div className="approval-timer">
      <div className="timer-container">
        {status === 'approved' ? (
          <div className="approval-success">
            <div className="success-icon">✓</div>
            <div className="success-message">Booking Approved!</div>
          </div>
        ) : (
          <>
            <CircularProgress
              variant="determinate"
              value={timerValue}
              size={80}
              thickness={4}
              className={status === 'approved' ? 'progress success' : 'progress'}
            />
            <div className="timer-content">
              {status === 'waiting' && (
                <>
                  <div className="time-left">{timeLeft}</div>
                  <div className="seconds">seconds</div>
                </>
              )}
            </div>
          </>
        )}
      </div>
      <h3 className={status === 'approved' ? 'success-text' : ''}>
        {status === 'approved'
          ? 'Booking Approved!'
          : status === 'rejected'
          ? 'Booking Rejected'
          : 'Waiting for Admin Approval'}
      </h3>
      <p className={status === 'approved' ? 'success-text' : ''}>
        {status === 'approved'
          ? 'Redirecting to payment...'
          : status === 'rejected'
          ? 'Sorry, the service provider is not available at this time.'
          : 'Please wait while we confirm your booking with the service provider...'}
      </p>
      {status === 'rejected' && (
        <div className="error-message">
          Sorry, the service provider is not available at this time.
        </div>
      )}
    </div>
  );
};

export default ApprovalTimer;
