import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import confetti from 'canvas-confetti';
import {
  UtensilsCrossed,
  PlusCircle,
  Clock,
  MapPin,
  Calendar,
  Image as ImageIcon,
  Flame,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

const PRESET_IMAGES = [
  { label: 'Cooked Meals / Biryani', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=60' },
  { label: 'Bakery / Bread', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=60' },
  { label: 'Fresh Produce / Veggies', url: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&auto=format&fit=crop&q=60' },
  { label: 'Pasta / Casserole', url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=60' },
  { label: 'Sandwiches & Wraps', url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=60' }
];

export default function AddFood() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const [form, setForm] = useState({
    foodName: '',
    category: 'Cooked Meals',
    quantity: '',
    quantityKg: 8.0,
    dietaryType: 'Vegetarian',
    urgency: 'NORMAL',
    location: user?.address || '120 Market St, Downtown',
    city: 'Metropolis',
    pickupTime: '',
    expiryTime: '',
    storageInstructions: 'Keep warm in insulated container',
    notes: '',
    imageUrl: PRESET_IMAGES[0].url
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setToast({ message: 'Please log in to donate food', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      await API.post('/api/donations', {
        ...form,
        quantityKg: parseFloat(form.quantityKg) || 5.0,
        donor: { id: user.id }
      });

      // Celebrate successful food donation with confetti!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setToast({ message: 'Food donation posted successfully! It is now AVAILABLE.', type: 'success' });
      setTimeout(() => {
        navigate('/my-donations');
      }, 1000);
    } catch (err) {
      setToast({ message: err.message || 'Failed to submit food donation', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <Navbar />

      <main className="narrow-container">
        <div className="card">
          <div className="card-header" style={{ marginBottom: '1.25rem' }}>
            <div>
              <h1 className="card-title">
                <PlusCircle size={22} color="var(--primary)" />
                <span>Post Surplus Food Donation</span>
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                Fill out the surplus details so partner charities can schedule a timely pickup.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Food Item / Meal Title</label>
              <input
                name="foodName"
                className="form-control"
                placeholder="e.g. Fresh Vegetable Biryani & Dal"
                value={form.foodName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  className="form-select"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="Cooked Meals">Cooked Meals</option>
                  <option value="Bakery & Bread">Bakery & Bread</option>
                  <option value="Fresh Produce">Fresh Produce (Fruits & Vegetables)</option>
                  <option value="Dairy & Packaged">Dairy & Packaged Goods</option>
                  <option value="Groceries & Dry Food">Groceries & Dry Food</option>
                  <option value="Beverages">Beverages</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Dietary Type</label>
                <select
                  name="dietaryType"
                  className="form-select"
                  value={form.dietaryType}
                  onChange={handleChange}
                >
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Halal">Halal</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Quantity Description</label>
                <input
                  name="quantity"
                  className="form-control"
                  placeholder="e.g. 40 portions, 3 trays, 15 kg"
                  value={form.quantity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Estimated Weight (kg) for Impact Math</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  name="quantityKg"
                  className="form-control"
                  placeholder="e.g. 15.0"
                  value={form.quantityKg}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Available Pickup Time</label>
                <input
                  name="pickupTime"
                  className="form-control"
                  placeholder="e.g. Today 4:00 PM - 7:00 PM"
                  value={form.pickupTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Expiry / Best Before</label>
                <input
                  name="expiryTime"
                  className="form-control"
                  placeholder="e.g. Today by 10:00 PM"
                  value={form.expiryTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Pickup Address</label>
                <input
                  name="location"
                  className="form-control"
                  placeholder="Street, Building, Unit"
                  value={form.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Urgency Level</label>
                <select
                  name="urgency"
                  className="form-select"
                  value={form.urgency}
                  onChange={handleChange}
                >
                  <option value="NORMAL">Normal (Pick up within standard window)</option>
                  <option value="URGENT">Urgent (Expires in a few hours)</option>
                  <option value="CRITICAL">Critical (Immediate dispatch needed)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Storage & Temperature Instructions</label>
              <input
                name="storageInstructions"
                className="form-control"
                placeholder="e.g. Refrigerate below 4°C, keep warm in hot boxes"
                value={form.storageInstructions}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Food Photo (Choose Preset or Custom URL)</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.65rem', marginBottom: '0.75rem' }}>
                {PRESET_IMAGES.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setForm(f => ({ ...f, imageUrl: img.url }))}
                    style={{
                      border: form.imageUrl === img.url ? '2px solid var(--primary)' : '1px solid var(--border)',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      textAlign: 'center',
                      background: form.imageUrl === img.url ? 'var(--primary-light)' : 'white'
                    }}
                  >
                    <img src={img.url} alt={img.label} style={{ width: '100%', height: '65px', objectFit: 'cover' }} />
                    <div style={{ padding: '0.3rem', fontSize: '0.72rem', fontWeight: 600 }}>{img.label}</div>
                  </div>
                ))}
              </div>
              <input
                name="imageUrl"
                className="form-control"
                placeholder="Or paste custom image URL"
                value={form.imageUrl}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Additional Preparation Notes (Optional)</label>
              <textarea
                name="notes"
                className="form-textarea"
                rows="2"
                placeholder="Allergen info, packaging details, parking/loading bay entrance..."
                value={form.notes}
                onChange={handleChange}
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.75rem' }}
              disabled={loading}
            >
              <Sparkles size={18} />
              <span>{loading ? 'Submitting...' : 'Post Donation Now'}</span>
            </button>
          </form>
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
