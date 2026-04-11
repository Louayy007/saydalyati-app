import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { getAuthToken, getAuthUser } from './lib/api';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Marketplace from './pages/Marketplace';
import CreateOffer from './pages/CreateOffer';
import ExchangeRequests from './pages/ExchangeRequests';
import Profile from './pages/Profile';

function AppContent() {
  const location = useLocation();

  function ProtectedRoute({ children, adminOnly = false }) {
    const token = getAuthToken();
    const user = getAuthUser();

    if (!token || !user) {
      return <Navigate to="/login" replace />;
    }

    const isApproved = user.role === 'administrator' || user.approvalStatus === 'approved';
    if (!isApproved) {
      return <Navigate to="/login" replace state={{ message: 'Votre compte doit être validé par un administrateur.' }} />;
    }

    if (adminOnly && user.role !== 'administrator') {
      return <Navigate to="/dashboard" replace />;
    }

    return children;
  }

  // Pages sans navbar
  const noNavbarPages = ['/login', '/signup', '/forgot-password'];
  const showNavbar = !noNavbarPages.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
        <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
        <Route path="/create-offer" element={<ProtectedRoute><CreateOffer /></ProtectedRoute>} />
        <Route path="/exchange-requests" element={<ProtectedRoute><ExchangeRequests /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Fallback route to avoid blank page on unknown URLs */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;