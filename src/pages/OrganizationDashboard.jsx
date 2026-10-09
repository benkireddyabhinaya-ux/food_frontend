import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import confetti from 'canvas-confetti';
import {
  Search,
  Truck,
  MapPin,
  Clock,
  Building2,
  Calendar,
  X,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles
} from 'lucide-react';

export default function OrganizationDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [dietaryFilter, setDietaryFilter] = useState('ALL');

  // Modal State for Scheduling
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    pickupTime: '',
    driverName: '',
    driverContact: '',
    vehicleNumber: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadAvailableDonations();
  }, [user?.id, navigate]);

  async function loadAvailableDonations() {
    setLoading(true);
    try {
      const res = await API.get('/api/donations/available');
      setDonations(res.data);
    } catch (err) {
      setToast({ message: 'Error loading donations: ' + err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  const openScheduleModal = (donation) => {
    setSelectedDonation(donation);
    setScheduleForm({
      pickupTime: donation.pickupTime || '',
      driverName: user.name + ' Logistics',
      driverContact: user.phone || '+1 (555) 019-2831',
      vehicleNumber: 'VAN-101',
      notes: 'Insulated cooler boxes on board.'
    });
    setModalOpen(true);
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDonation) return;

    setSubmitting(true);
    try {
      await API.post('/api/pickups', {
        donationId: selectedDonation.id,
        organizationId: user.id,
        pickupTime: scheduleForm.pickupTime,
        driverName: scheduleForm.driverName,
        driverContact: scheduleForm.driverContact,
        vehicleNumber: scheduleForm.vehicleNumber,
        notes: scheduleForm.notes
      });

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.5 }
      });

      setToast({
        message: `Pickup scheduled for ${selectedDonation.foodName}! Driver assigned.`,
        type: 'success'
      });

      setModalOpen(false);
      loadAvailableDonations();
    } catch (err) {
      setToast({ message: err.message || 'Could not schedule pickup', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredDonations = donations.filter((d) => {
    const matchesQuery =
      searchQuery === '' ||
      d.foodName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.donor?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === 'ALL' || d.category === categoryFilter;

    const matchesDietary =
      dietaryFilter === 'ALL' || d.dietaryType === dietaryFilter;

    return matchesQuery && matchesCategory && matchesDietary;
  });

  return (
    <div className="app-layout">
      <Navbar />

      <main className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)' }}>
                Surplus Food Catalog
              </h1>
              <span className="role-pill role-org">NGO Dispatch</span>
            </div>
            <p style={{ color: 'var(--text-muted)' }}>
              Browse real-time excess food posted by restaurants, grocery stores, and bakeries.
            </p>
          </div>

          <Link to="/pickups" className="btn btn-secondary">
            <Truck size={18} />
            <span>My Scheduled Pickups</span>
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
          <div className="filter-bar" style={{ marginBottom: '1rem' }}>
            <div className="search-input-wrap">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search surplus by meal name, donor, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select
                className="form-select"
                style={{ width: 'auto', padding: '0.6rem 0.85rem' }}
                value={dietaryFilter}
                onChange={(e) => setDietaryFilter(e.target.value)}
              >
                <option value="ALL">All Diets</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Halal">Halal</option>
              </select>
            </div>
          </div>

          <div className="filter-chip-group">
            {['ALL', 'Cooked Meals', 'Bakery & Bread', 'Fresh Produce', 'Dairy & Packaged', 'Groceries & Dry Food'].map((cat) => (
              <button
                key={cat}
                className={`filter-chip ${categoryFilter === cat ? 'active' : ''}`}
                onClick={() => setCategoryFilter(cat)}
              >
                {cat === 'ALL' ? 'All Categories' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
            Finding available food listings...
          </div>
        ) : filteredDonations.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <Truck size={42} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              No available donations found
            </h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto' }}>
              {searchQuery || categoryFilter !== 'ALL' || dietaryFilter !== 'ALL'
                ? 'Try adjusting your search criteria or filters to see more listings.'
                : 'All surplus batches have been claimed. Check back soon for new donations!'}
            </p>
          </div>
        ) : (
          <div className="food-grid">
            {filteredDonations.map((d) => (
              <div key={d.id} className="food-card">
                <div className="food-image-wrap">
                  <img
                    src={d.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=60'}
                    alt={d.foodName}
                    className="food-image"
                  />
                  <span className={`food-urgency-badge urgency-${d.urgency || 'NORMAL'}`}>
                    <Clock size={12} />
                    {d.urgency === 'URGENT' ? 'Expires Soon' : 'Available'}
                  </span>
                  <span className="food-category-badge">{d.category}</span>
                </div>

                <div className="food-card-body">
                  <h3 className="food-name">{d.foodName}</h3>

                  <div className="food-meta">
                    <div className="food-meta-row">
                      <Building2 size={15} color="#94a3b8" />
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{d.donor?.name || 'Local Donor'}</span>
                    </div>
                    <div className="food-meta-row">
                      <MapPin size={15} color="#94a3b8" />
                      <span>{d.location}</span>
                    </div>
                    <div className="food-meta-row">
                      <Clock size={15} color="#94a3b8" />
                      <span>Pickup: {d.pickupTime}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <span className="food-dietary-badge">{d.dietaryType}</span>
                    {d.storageInstructions && (
                      <span className="food-dietary-badge" style={{ background: '#e0f2fe', color: '#0369a1' }}>
                        {d.storageInstructions}
                      </span>
                    )}
                  </div>

                  <div className="food-card-footer">
                    <div>
                      <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>
                        {d.quantity}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.35rem' }}>
                        (~{d.quantityKg} kg)
                      </span>
                    </div>

                    <button
                      onClick={() => openScheduleModal(d)}
                      className="btn btn-primary btn-sm"
                    >
                      <Truck size={14} />
                      <span>Claim & Schedule</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Schedule Pickup Modal */}
        {modalOpen && selectedDonation && (
          <div className="modal-overlay" onClick={() => setModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Schedule Food Pickup</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {selectedDonation.foodName} ({selectedDonation.quantity})
                  </p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleScheduleSubmit}>
                <div className="modal-body">
                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem 1rem',
                    marginBottom: '1.25rem',
                    fontSize: '0.88rem'
                  }}>
                    <div><strong>Donor:</strong> {selectedDonation.donor?.name}</div>
                    <div><strong>Pickup Location:</strong> {selectedDonation.location}</div>
                    <div><strong>Donor Window:</strong> {selectedDonation.pickupTime}</div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Scheduled Arrival Time</label>
                    <input
                      className="form-control"
                      value={scheduleForm.pickupTime}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, pickupTime: e.target.value })}
                      placeholder="e.g. Today at 5:30 PM"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Assigned Driver / Contact</label>
                      <input
                        className="form-control"
                        value={scheduleForm.driverName}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, driverName: e.target.value })}
                        placeholder="Driver Name"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Driver Phone Number</label>
                      <input
                        className="form-control"
                        value={scheduleForm.driverContact}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, driverContact: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Vehicle Registration / Identifier</label>
                    <input
                      className="form-control"
                      value={scheduleForm.vehicleNumber}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, vehicleNumber: e.target.value })}
                      placeholder="e.g. VAN-402 (Refrigerated)"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Driver Notes</label>
                    <input
                      className="form-control"
                      value={scheduleForm.notes}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
                      placeholder="Loading dock access, insulated boxes, etc."
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    <CheckCircle2 size={16} />
                    <span>{submitting ? 'Scheduling...' : 'Confirm Pickup'}</span>
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
