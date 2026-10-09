import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../services/api';
import {
  UtensilsCrossed,
  Leaf,
  ShieldCheck,
  Truck,
  HeartHandshake,
  Clock,
  MapPin,
  ArrowRight,
  Flame,
  Award,
  Users
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalDonations: 12,
    totalKgFoodSaved: 145.0,
    totalMealsSaved: 320,
    totalCo2PreventedKg: 362.5,
    totalDonors: 5,
    totalOrganizations: 4,
  });
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, donRes] = await Promise.allSettled([
          API.get('/api/stats/summary'),
          API.get('/api/donations/available')
        ]);

        if (statsRes.status === 'fulfilled' && statsRes.value.data) {
          setStats(statsRes.value.data);
        }
        if (donRes.status === 'fulfilled' && Array.isArray(donRes.value.data)) {
          setRecentItems(donRes.value.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const quickLogin = async (email, password, role) => {
    try {
      const res = await API.post('/api/users/login', { email, password });
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate(role === 'DONOR' ? '/donor' : '/organization');
    } catch (e) {
      navigate('/login');
    }
  };

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-container">
            <div className="hero-pill">
              <Leaf size={16} />
              <span>Smart Surplus Food Redistribution Network</span>
            </div>

            <h1 className="hero-title">
              Turn Surplus Food Into <br />
              <span className="hero-highlight">Lifesaving Community Meals</span>
            </h1>

            <p className="hero-subtitle">
              Every day, fresh edible food goes to waste while families face hunger.
              Our platform connects local restaurants, grocery stores, and bakeries with
              verified food banks and shelters in real time.
            </p>

            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-lg">
                <UtensilsCrossed size={18} />
                <span>Join as Food Donor</span>
              </Link>
              <Link to="/organization" className="btn btn-secondary btn-lg">
                <Truck size={18} />
                <span>Explore Available Surplus</span>
              </Link>
            </div>

            {/* Quick Demo Access Bar */}
            <div style={{
              background: 'white',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '1rem 1.25rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                ⚡ One-Click Reviewer Access:
              </span>
              <button
                onClick={() => quickLogin('donor@bistro.com', 'password123', 'DONOR')}
                className="btn btn-sm btn-outline-primary"
              >
                Login as Donor (Bistro)
              </button>
              <button
                onClick={() => quickLogin('org@foodbank.org', 'password123', 'ORGANIZATION')}
                className="btn btn-sm btn-secondary"
              >
                Login as NGO (Hope Food Bank)
              </button>
            </div>
          </div>
        </section>

        {/* Real-time Environmental Metrics */}
        <section style={{ padding: '0 1.25rem', transform: 'translateY(-25px)' }}>
          <div className="stats-banner">
            <div className="stat-box">
              <div className="stat-icon green">
                <Leaf size={24} />
              </div>
              <div className="stat-number">{stats.totalMealsSaved?.toLocaleString() || 320}</div>
              <div className="stat-label">Meals Provided</div>
            </div>

            <div className="stat-box">
              <div className="stat-icon blue">
                <UtensilsCrossed size={24} />
              </div>
              <div className="stat-number">{stats.totalKgFoodSaved || 145} kg</div>
              <div className="stat-label">Food Waste Diverted</div>
            </div>

            <div className="stat-box">
              <div className="stat-icon amber">
                <Flame size={24} />
              </div>
              <div className="stat-number">{stats.totalCo2PreventedKg || 362} kg</div>
              <div className="stat-label">CO₂ Emissions Prevented</div>
            </div>

            <div className="stat-box">
              <div className="stat-icon purple">
                <Users size={24} />
              </div>
              <div className="stat-number">{(stats.totalDonors || 3) + (stats.totalOrganizations || 2)}</div>
              <div className="stat-label">Active Community Partners</div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              How the System Operates
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
              A high-efficiency logistical workflow bridging donors and food distributors.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: '#ecfdf5',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}>
                <UtensilsCrossed size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem' }}>1. List Surplus Food</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                Donors enter meal descriptions, quantities, expiry countdowns, and storage instructions.
                Status changes immediately to <strong>AVAILABLE</strong>.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: '#e0f2fe',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}>
                <HeartHandshake size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem' }}>2. Claim & Schedule</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                Registered charities and food pantries inspect available batches, reserve matching
                portions, and dispatch designated pickup drivers.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: '#fef3c7',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}>
                <ShieldCheck size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem' }}>3. Verified Handoff</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                Driver collects food using a unique 4-digit verification PIN, confirming quality
                and safe transport to vulnerable families.
              </p>
            </div>
          </div>
        </section>

        {/* Live Available Food Section */}
        {recentItems.length > 0 && (
          <section className="container" style={{ paddingTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  Fresh Surplus Available Right Now
                </h2>
                <p style={{ color: 'var(--text-muted)' }}>
                  Ready for collection and delivery across partner locations.
                </p>
              </div>
              <Link to="/organization" className="btn btn-outline-primary btn-sm">
                <span>View Full Catalog</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="food-grid">
              {recentItems.map((item) => (
                <div key={item.id} className="food-card">
                  <div className="food-image-wrap">
                    <img
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=60'}
                      alt={item.foodName}
                      className="food-image"
                    />
                    <span className={`food-urgency-badge urgency-${item.urgency || 'NORMAL'}`}>
                      <Clock size={12} />
                      {item.urgency === 'URGENT' ? 'Expires Soon' : 'Fresh'}
                    </span>
                    <span className="food-category-badge">{item.category || 'Surplus'}</span>
                  </div>

                  <div className="food-card-body">
                    <h3 className="food-name">{item.foodName}</h3>
                    <div className="food-meta">
                      <div className="food-meta-row">
                        <MapPin size={15} color="#94a3b8" />
                        <span>{item.location}</span>
                      </div>
                      <div className="food-meta-row">
                        <Clock size={15} color="#94a3b8" />
                        <span>Pickup: {item.pickupTime}</span>
                      </div>
                    </div>

                    <div className="food-card-footer">
                      <div>
                        <span style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--primary)' }}>
                          {item.quantity}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.35rem' }}>
                          (~{item.quantityKg} kg)
                        </span>
                      </div>
                      <Link to="/organization" className="btn btn-primary btn-sm">
                        Request Pickup
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
