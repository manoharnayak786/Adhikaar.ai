import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Toaster } from './components/ui/sonner';
import Home from './pages/Home';
import Wallet from './pages/Wallet';
import Library from './pages/Library';
import SOS from './pages/SOS';
import Profile from './pages/Profile';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const AUTH_URL = 'https://auth.emergentagent.com';
const SESSION_DATA_URL = 'https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for session_id in URL fragment (after OAuth)
    const hash = window.location.hash;
    if (hash.includes('session_id=')) {
      const sessionId = hash.split('session_id=')[1].split('&')[0];
      handleSessionId(sessionId);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // Check for existing session
      checkSession();
    }
  }, []);

  const handleSessionId = async (sessionId) => {
    try {
      // Get session data from Emergent
      const response = await axios.get(SESSION_DATA_URL, {
        headers: { 'X-Session-ID': sessionId },
      });

      const { email, name, picture, session_token } = response.data;

      // Send session to backend
      const backendResponse = await axios.post(
        `${BACKEND_URL}/api/auth/session`,
        {
          session_token,
          email,
          name,
          picture,
        },
        { withCredentials: true }
      );

      setUser(backendResponse.data.user);
    } catch (error) {
      console.error('Session error:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkSession = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/auth/me`, {
        withCredentials: true,
      });
      setUser(response.data.user);
    } catch (error) {
      // Not authenticated
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    const redirectUrl = `${window.location.origin}/`;
    window.location.href = `${AUTH_URL}?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/auth/logout`, {}, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Header user={user} onLogin={handleLogin} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/library" element={<Library />} />
          <Route path="/sos" element={<SOS />} />
          <Route path="/profile" element={<Profile user={user} onLogout={handleLogout} />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
