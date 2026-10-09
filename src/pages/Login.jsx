import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import { UtensilsCrossed, Lock, Mail, Eye, EyeOff, Sparkles, Building2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/api/users/login', { email, password });
      localStorage.setItem('user', JSON.stringify(res.data));
      setToast({ message: 'Welcome back, ' + res.data.name + '!', type: 'success' });
      setTimeout(() => {
        navigate(res.data.role === 'DONOR' ? '/donor' : '/organization');
      }, 500);
    } catch (err) {
      setToast({ message: err.message || 'Invalid email or password', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="app-layout">
      <Navbar />

      <main className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <div className="brand-icon" style={{ margin: '0 auto', width: '48px', height: '48px' }}>
              <UtensilsCrossed size={26} />
            </div>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to coordinate surplus food redistribution</p>
          </div>

          {/* Quick Demo Fill Buttons */}
          <div className="demo-box">
            <div className="demo-title">⚡ Quick 1-Click Demo Accounts</div>
            <div className="demo-buttons">
              <button
                type="button"
                onClick={() => fillDemo('donor@bistro.com', 'password123')}
                className="btn btn-sm btn-outline-primary"
              >
                Food Donor (Bistro)
              </button>
              <button
                type="button"
                onClick={() => fillDemo('org@foodbank.org', 'password123')}
                className="btn btn-sm btn-secondary"
              >
                NGO (Food Bank)
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="name@organization.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem' }}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
            Don't have an account yet?{' '}
            <Link to="/register" style={{ fontWeight: '600', color: 'var(--primary)' }}>
              Create an account
            </Link>
          </p>
        </div>
      </main>

      <Footer />

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'info' })}
      />
    </div>
  );
}
