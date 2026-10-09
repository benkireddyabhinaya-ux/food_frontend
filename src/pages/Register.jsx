import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import { UtensilsCrossed, Building2, Mail, Lock, Phone, MapPin, CheckCircle2 } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'DONOR',
    organizationType: 'Restaurant',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'role' && value === 'DONOR' ? { organizationType: 'Restaurant' } : {}),
      ...(name === 'role' && value === 'ORGANIZATION' ? { organizationType: 'Food Bank' } : {})
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/api/users/register', form);
      localStorage.setItem('user', JSON.stringify(res.data));
      setToast({ message: 'Account created successfully! Redirecting...', type: 'success' });
      setTimeout(() => {
        navigate(res.data.role === 'DONOR' ? '/donor' : '/organization');
      }, 800);
    } catch (err) {
      setToast({ message: err.message || 'Registration failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <Navbar />

      <main className="auth-wrapper">
        <div className="auth-card" style={{ maxWidth: '540px' }}>
          <div className="auth-header">
            <div className="brand-icon" style={{ margin: '0 auto', width: '48px', height: '48px' }}>
              <UtensilsCrossed size={26} />
            </div>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join the mission to eliminate edible food waste</p>
          </div>

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">I am joining as</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => handleChange({ target: { name: 'role', value: 'DONOR' } })}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: form.role === 'DONOR' ? '2px solid var(--primary)' : '1px solid var(--border)',
                    background: form.role === 'DONOR' ? 'var(--primary-light)' : 'white',
                    color: form.role === 'DONOR' ? 'var(--primary)' : 'var(--text-main)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <UtensilsCrossed size={16} /> Food Donor
                </button>

                <button
                  type="button"
                  onClick={() => handleChange({ target: { name: 'role', value: 'ORGANIZATION' } })}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: form.role === 'ORGANIZATION' ? '2px solid var(--primary)' : '1px solid var(--border)',
                    background: form.role === 'ORGANIZATION' ? 'var(--primary-light)' : 'white',
                    color: form.role === 'ORGANIZATION' ? 'var(--primary)' : 'var(--text-main)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Building2 size={16} /> NGO / Shelter
                </button>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  {form.role === 'DONOR' ? 'Establishment Name' : 'Organization Name'}
                </label>
                <input
                  name="name"
                  className="form-control"
                  placeholder="e.g. Green Leaf Bistro"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Type / Category</label>
                <select
                  name="organizationType"
                  className="form-select"
                  value={form.organizationType}
                  onChange={handleChange}
                >
                  {form.role === 'DONOR' ? (
                    <>
                      <option value="Restaurant">Restaurant</option>
                      <option value="Supermarket">Supermarket</option>
                      <option value="Bakery">Bakery</option>
                      <option value="Hotel/Catering">Hotel / Catering</option>
                      <option value="Corporate Cafeteria">Corporate Cafeteria</option>
                      <option value="Individual">Individual Donor</option>
                    </>
                  ) : (
                    <>
                      <option value="Food Bank">Food Bank</option>
                      <option value="Homeless Shelter">Homeless Shelter</option>
                      <option value="Community Kitchen">Community Kitchen</option>
                      <option value="Charity NGO">Charity NGO</option>
                      <option value="Orphanage">Orphanage / Youth Home</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="contact@org.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  name="phone"
                  className="form-control"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Physical Address</label>
                <input
                  name="address"
                  className="form-control"
                  placeholder="Street, City, Zip"
                  value={form.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.75rem', padding: '0.85rem' }}
              disabled={loading}
            >
              {loading ? 'Registering Account...' : 'Complete Registration'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: '600', color: 'var(--primary)' }}>
              Sign in
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
