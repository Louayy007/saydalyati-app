import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import CreateOffer from './pages/CreateOffer';
import ExchangeRequests from './pages/ExchangeRequests';

function AppContent() {
  const location = useLocation();

  // Pages sans navbar
  const noNavbarPages = ['/login', '/signup'];
  const showNavbar = !noNavbarPages.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/create-offer" element={<CreateOffer />} />
        <Route path="/exchange-requests" element={<ExchangeRequests />} />
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