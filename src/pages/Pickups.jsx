import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import confetti from 'canvas-confetti';
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  Calendar,
  Key,
  Check,
  AlertCircle,
  X,
  Phone,
  Sparkles
} from 'lucide-react';

const STEPS = ['SCHEDULED', 'IN_TRANSIT', 'COLLECTED', 'COMPLETED'];

export default function Pickups() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ACTIVE');

  // Verify PIN Modal State
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [enteredPin, setEnteredPin] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadPickups();
  }, [user?.id, navigate]);

  async function loadPickups() {
    try {
      const res = await API.get(`/api/pickups/organization/${user.id}`);
      setPickups(res.data);
    } catch (err) {
      setToast({ message: 'Error loading pickups: ' + err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  const updateStatus = async (id, newStatus) => {
    try {
      await API.put(`/api/pickups/${id}/status`, null, { params: { status: newStatus } });
      if (newStatus === 'COMPLETED') {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
        setToast({ message: 'Pickup marked as COMPLETED! Food saved!', type: 'success' });
      } else {
        setToast({ message: `Status updated to ${newStatus}`, type: 'success' });
      }
      loadPickups();
    } catch (err) {
      setToast({ message: err.message || 'Could not update status', type: 'error' });
    }
  };

  const openVerifyModal = (pickup) => {
    setSelectedPickup(pickup);
    setEnteredPin('');
    setVerifyModalOpen(true);
  };

  const handleVerifyPin = async (e) => {
    e.preventDefault();
    if (!selectedPickup) return;

    setVerifying(true);
    try {
      await API.post(`/api/pickups/${selectedPickup.id}/verify`, null, { params: { code: enteredPin } });
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 }
      });
      setToast({ message: 'Donor PIN verified successfully! Pickup is COMPLETED.', type: 'success' });
      setVerifyModalOpen(false);
      loadPickups();
    } catch (err) {
      setToast({ message: err.message || 'Invalid verification PIN', type: 'error' });
    } finally {
      setVerifying(false);
    }
  };

  const activePickups = pickups.filter((p) => p.status !== 'COMPLETED');
  const completedPickups = pickups.filter((p) => p.status === 'COMPLETED');
  const displayedPickups = activeTab === 'ACTIVE' ? activePickups : completedPickups;

  const getStepIndex = (status) => {
    const idx = STEPS.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  return (
    <div className="app-layout">
      <Navbar />

      <main className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)' }}>
              Pickup Coordination
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Track driver status, collect donor PINs, and verify food delivery.
            </p>
          </div>

          <Link to="/organization" className="btn btn-primary">
            <Truck size={18} />
            <span>Claim More Surplus Food</span>
          </Link>
        </div>

        {/* Tab Selection */}
        <div className="filter-chip-group" style={{ marginBottom: '2rem' }}>
          <button
            className={`filter-chip ${activeTab === 'ACTIVE' ? 'active' : ''}`}
            onClick={() => setActiveTab('ACTIVE')}
          >
            Active Dispatches ({activePickups.length})
          </button>
          <button
            className={`filter-chip ${activeTab === 'COMPLETED' ? 'active' : ''}`}
            onClick={() => setActiveTab('COMPLETED')}
          >
            Completed Deliveries ({completedPickups.length})
          </button>
        </div>

        {/* Pickups List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
            Loading pickups...
          </div>
        ) : displayedPickups.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <Truck size={42} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              {activeTab === 'ACTIVE' ? 'No active dispatches currently' : 'No completed deliveries yet'}
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
              {activeTab === 'ACTIVE'
                ? 'Check the surplus catalog to claim fresh food batches and schedule pickups.'
                : 'Deliveries will show up here once driver handoff is verified.'}
            </p>
            {activeTab === 'ACTIVE' && (
              <Link to="/organization" className="btn btn-primary">
                Browse Surplus Catalog
              </Link>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {displayedPickups.map((p) => {
              const currentStep = getStepIndex(p.status);
              return (
                <div key={p.id} className="card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                      <img
                        src={p.donation?.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=60'}
                        alt={p.donation?.foodName}
                        style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                            {p.donation?.foodName}
                          </h3>
                          <span className={`status-pill status-${p.status}`}>{p.status}</span>
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                          Donor: <strong>{p.donation?.donor?.name}</strong> • Quantity: <strong>{p.donation?.quantity} (~{p.donation?.quantityKg} kg)</strong>
                        </div>
                        <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <MapPin size={14} color="#94a3b8" />
                            <span>{p.donation?.location}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Clock size={14} color="#94a3b8" />
                            <span>Pickup Time: {p.pickupTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Driver details badge */}
                    <div style={{
                      background: '#f8fafc',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem 1rem',
                      fontSize: '0.85rem',
                      minWidth: '220px'
                    }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                        Driver: {p.driverName || 'Designated Driver'}
                      </div>
                      <div style={{ color: 'var(--text-muted)' }}>Phone: {p.driverContact || 'N/A'}</div>
                      {p.vehicleNumber && <div style={{ color: 'var(--text-muted)' }}>Vehicle: {p.vehicleNumber}</div>}
                    </div>
                  </div>

                  {/* Step Timeline */}
                  <div className="timeline-stepper">
                    {STEPS.map((step, idx) => {
                      const isCompleted = idx < currentStep || p.status === 'COMPLETED';
                      const isActive = idx === currentStep && p.status !== 'COMPLETED';
                      return (
                        <div key={step} className="timeline-step">
                          <div className={`step-circle ${isCompleted ? 'completed' : isActive ? 'active' : ''}`}>
                            {isCompleted ? <Check size={14} /> : idx + 1}
                          </div>
                          <div className="step-title" style={{
                            color: isCompleted || isActive ? 'var(--text-main)' : 'var(--text-muted)',
                            fontWeight: isCompleted || isActive ? 700 : 500
                          }}>
                            {step.replace('_', ' ')}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Status Actions */}
                  {p.status !== 'COMPLETED' && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: '0.75rem',
                      marginTop: '1.25rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid var(--border)',
                      flexWrap: 'wrap'
                    }}>
                      {p.status === 'SCHEDULED' && (
                        <button
                          onClick={() => updateStatus(p.id, 'IN_TRANSIT')}
                          className="btn btn-secondary btn-sm"
                        >
                          <Truck size={14} />
                          <span>Dispatch / In Transit</span>
                        </button>
                      )}

                      {p.status === 'IN_TRANSIT' && (
                        <button
                          onClick={() => updateStatus(p.id, 'COLLECTED')}
                          className="btn btn-secondary btn-sm"
                        >
                          <CheckCircle2 size={14} />
                          <span>Mark Collected</span>
                        </button>
                      )}

                      <button
                        onClick={() => openVerifyModal(p)}
                        className="btn btn-primary btn-sm"
                      >
                        <Key size={14} />
                        <span>Confirm Delivery with PIN</span>
                      </button>

                      <button
                        onClick={() => updateStatus(p.id, 'COMPLETED')}
                        className="btn btn-outline-primary btn-sm"
                      >
                        <Check size={14} />
                        <span>Force Complete</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* PIN Verification Modal */}
        {verifyModalOpen && selectedPickup && (
          <div className="modal-overlay" onClick={() => setVerifyModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
              <div className="modal-header">
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Confirm Handoff PIN</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Enter the 4-digit code provided by the donor.
                  </p>
                </div>
                <button
                  onClick={() => setVerifyModalOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleVerifyPin}>
                <div className="modal-body" style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem'
                  }}>
                    <Key size={28} />
                  </div>

                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                    Ask the donor at <strong>{selectedPickup.donation?.donor?.name}</strong> for their 4-digit verification code.
                  </p>

                  <input
                    type="text"
                    maxLength={6}
                    value={enteredPin}
                    onChange={(e) => setEnteredPin(e.target.value)}
                    placeholder="e.g. 4821"
                    className="form-control"
                    style={{
                      textAlign: 'center',
                      fontSize: '1.5rem',
                      letterSpacing: '0.25em',
                      fontWeight: 800,
                      maxWidth: '220px',
                      margin: '0 auto'
                    }}
                    required
                    autoFocus
                  />
                </div>

                <div className="modal-footer" style={{ justifyContent: 'center' }}>
                  <button
                    type="button"
                    onClick={() => setVerifyModalOpen(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={verifying}
                  >
                    {verifying ? 'Verifying...' : 'Verify & Complete Delivery'}
                  </button>
                </div>
              </form>
            </div>
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
