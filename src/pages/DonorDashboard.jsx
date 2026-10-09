import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../services/api';
import {
  PlusCircle,
  Package,
  CheckCircle2,
  Clock,
  Leaf,
  Flame,
  ArrowRight,
  ShieldAlert,
  MapPin,
  Calendar
} from 'lucide-react';

export default function DonorDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    async function loadDonations() {
      try {
        const res = await API.get(`/api/donations/donor/${user.id}`);
        setDonations(res.data);
      } catch (err) {
        console.error('Error fetching donor donations:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDonations();
  }, [user?.id, navigate]);

  const totalKg = donations.reduce((acc, curr) => acc + (curr.quantityKg || 5), 0);
  const activeCount = donations.filter(d => d.status === 'AVAILABLE' || d.status === 'CLAIMED' || d.status === 'SCHEDULED').length;
  const completedCount = donations.filter(d => d.status === 'COMPLETED').length;
  const mealsSaved = Math.round(totalKg * 2.2);

  return (
    <div className="app-layout">
      <Navbar />

      <main className="container">
        {/* Welcome Banner */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)' }}>
                Welcome back, {user?.name}
              </h1>
              <span className="role-pill role-donor">Donor Portal</span>
            </div>
            <p style={{ color: 'var(--text-muted)' }}>
              Manage your food listings and track pickups in real time.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/add-food" className="btn btn-primary">
              <PlusCircle size={18} />
              <span>Donate Surplus Food</span>
            </Link>
            <Link to="/my-donations" className="btn btn-secondary">
              <Package size={18} />
              <span>All Donations ({donations.length})</span>
            </Link>
          </div>
        </div>

        {/* Impact Cards */}
        <div className="stats-banner" style={{ marginBottom: '2.5rem' }}>
          <div className="stat-box">
            <div className="stat-icon green">
              <Package size={22} />
            </div>
            <div className="stat-number">{donations.length}</div>
            <div className="stat-label">Total Listings</div>
          </div>

          <div className="stat-box">
            <div className="stat-icon blue">
              <Clock size={22} />
            </div>
            <div className="stat-number">{activeCount}</div>
            <div className="stat-label">Active / In Progress</div>
          </div>

          <div className="stat-box">
            <div className="stat-icon purple">
              <CheckCircle2 size={22} />
            </div>
            <div className="stat-number">{completedCount}</div>
            <div className="stat-label">Completed Pickups</div>
          </div>

          <div className="stat-box">
            <div className="stat-icon amber">
              <Leaf size={22} />
            </div>
            <div className="stat-number">{mealsSaved}</div>
            <div className="stat-label">Est. Meals Provided</div>
          </div>
        </div>

        {/* Active Donations Section */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <div>
              <h2 className="card-title">Recent Surplus Listings</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Track the status of your listed surplus food batches.
              </p>
            </div>
            <Link to="/my-donations" className="btn btn-outline-primary btn-sm">
              <span>Manage All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              Loading donations...
            </div>
          ) : donations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <PlusCircle size={32} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                No food donations listed yet
              </h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
                Ready to donate excess cooked meals, baked goods, or fresh produce?
                Listing takes less than 60 seconds.
              </p>
              <Link to="/add-food" className="btn btn-primary">
                <PlusCircle size={17} />
                <span>Create Your First Donation</span>
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Item / Description</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Pickup Window</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.slice(0, 5).map((d) => (
                    <tr key={d.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={d.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=60'}
                            alt={d.foodName}
                            style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: '700' }}>{d.foodName}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{d.dietaryType}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="food-dietary-badge">{d.category}</span>
                      </td>
                      <td>
                        <strong>{d.quantity}</strong>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
                          <Calendar size={13} color="#94a3b8" />
                          <span>{d.pickupTime}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`status-pill status-${d.status}`}>{d.status}</span>
                      </td>
                      <td>
                        <Link to="/my-donations" className="btn btn-secondary btn-sm">
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Safety Guidelines Card */}
        <div style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
          border: '1px solid var(--primary-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem'
        }}>
          <div style={{ background: '#10b981', color: 'white', padding: '0.5rem', borderRadius: '8px' }}>
            <ShieldAlert size={24} />
          </div>
          <div>
            <h4 style={{ fontWeight: '700', color: '#064e3b', marginBottom: '0.25rem' }}>
              Safe Food Redistribution Standards
            </h4>
            <p style={{ fontSize: '0.9rem', color: '#065f46', lineHeight: '1.5' }}>
              Always ensure perishable items are stored at proper food safety temperatures (cold foods below 4°C / 40°F, hot items above 60°C / 140°F).
              Keep donations labeled with preparation time and allergen warnings.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
