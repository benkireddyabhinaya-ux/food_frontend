import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import {
  Package,
  PlusCircle,
  Trash2,
  Clock,
  MapPin,
  Calendar,
  Key,
  Truck,
  CheckCircle2,
  Copy,
  Info
} from 'lucide-react';

export default function MyDonations() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [donations, setDonations] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadData();
  }, [user?.id, navigate]);

  async function loadData() {
    try {
      const [donRes, pickRes] = await Promise.all([
        API.get(`/api/donations/donor/${user.id}`),
        API.get(`/api/pickups/donor/${user.id}`)
      ]);
      setDonations(donRes.data);
      setPickups(pickRes.data);
    } catch (err) {
      setToast({ message: 'Could not load donations: ' + err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this donation listing?')) return;
    try {
      await API.delete(`/api/donations/${id}`);
      setToast({ message: 'Donation listing removed', type: 'success' });
      loadData();
    } catch (err) {
      setToast({ message: err.message || 'Could not delete donation', type: 'error' });
    }
  };

  const copyPin = (pin) => {
    navigator.clipboard.writeText(pin);
    setToast({ message: `Handoff PIN ${pin} copied to clipboard! Give this to the pickup driver.`, type: 'success' });
  };

  const filteredDonations = donations.filter((d) => {
    if (filter === 'ALL') return true;
    return d.status === filter;
  });

  return (
    <div className="app-layout">
      <Navbar />

      <main className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)' }}>
              My Food Donations
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Track donation lifecycle, view assigned charities, and share pickup PINs.
            </p>
          </div>

          <Link to="/add-food" className="btn btn-primary">
            <PlusCircle size={18} />
            <span>New Food Donation</span>
          </Link>
        </div>

        {/* Filter Chips */}
        <div className="filter-chip-group" style={{ marginBottom: '1.5rem' }}>
          {['ALL', 'AVAILABLE', 'CLAIMED', 'SCHEDULED', 'COMPLETED'].map((st) => (
            <button
              key={st}
              className={`filter-chip ${filter === st ? 'active' : ''}`}
              onClick={() => setFilter(st)}
            >
              {st === 'ALL' ? 'All Donations' : st} (
              {st === 'ALL' ? donations.length : donations.filter((d) => d.status === st).length})
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Loading your donations...
          </div>
        ) : filteredDonations.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
            <Package size={42} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              No donations found in this category
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              {filter === 'ALL'
                ? 'You have not submitted any food donations yet.'
                : `No donations currently marked as ${filter}.`}
            </p>
            <Link to="/add-food" className="btn btn-primary">
              <PlusCircle size={16} />
              <span>Create Food Donation</span>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {filteredDonations.map((d) => {
              const matchedPickup = pickups.find((p) => p.donation?.id === d.id);
              return (
                <div key={d.id} className="card" style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                      <img
                        src={d.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=60'}
                        alt={d.foodName}
                        style={{ width: '90px', height: '90px', borderRadius: '12px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{d.foodName}</h3>
                          <span className={`status-pill status-${d.status}`}>{d.status}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.88rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                          <span className="food-dietary-badge">{d.category}</span>
                          <span className="food-dietary-badge">{d.dietaryType}</span>
                          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{d.quantity} (~{d.quantityKg} kg)</span>
                        </div>
                        <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <MapPin size={14} color="#94a3b8" />
                            <span>{d.location}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Clock size={14} color="#94a3b8" />
                            <span>Pickup: {d.pickupTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                      {/* If scheduled, display pickup driver and PIN */}
                      {matchedPickup && (
                        <div style={{
                          background: '#f8fafc',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-md)',
                          padding: '0.6rem 0.9rem',
                          textAlign: 'right'
                        }}>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                            Assigned NGO: <strong>{matchedPickup.organization?.name}</strong>
                          </div>
                          {matchedPickup.verificationCode && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Driver Handoff PIN:</span>
                              <span className="pin-badge">{matchedPickup.verificationCode}</span>
                              <button
                                onClick={() => copyPin(matchedPickup.verificationCode)}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '0.2rem 0.45rem' }}
                                title="Copy PIN"
                              >
                                <Copy size={12} />
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {d.status === 'AVAILABLE' && (
                          <button
                            onClick={() => handleDelete(d.id)}
                            className="btn btn-danger btn-sm"
                          >
                            <Trash2 size={14} />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
