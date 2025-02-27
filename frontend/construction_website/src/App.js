import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landingpage from './Landingpage';
import Login from '../src/components/Login';
import Signup from '../src/components/Signup';
import Forgot from '../src/components/Forgot';
import Homepage from './Homepage';
import AdminDashboard from '../src/components/AdminDashboard';
import AvailableProviders from '../src/components/AvailableProviders';
import BookingStatus from '../src/components/BookingStatus';
import BookingSuccess from './components/BookingSuccess';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/available-providers" element={<AvailableProviders />} />
        <Route path="/booking-status" element={<BookingStatus />} />
        <Route path="/booking-success" element={<BookingSuccess />} />
      </Routes>
    </Router>
  );
};

export default App;
