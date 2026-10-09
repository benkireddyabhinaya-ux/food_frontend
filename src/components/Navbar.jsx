import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UtensilsCrossed, PlusCircle, Package, Truck, BarChart3, LogOut, Menu, X, Sparkles, Building2 } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const logout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="brand-link">
          <div className="brand-icon">
            <UtensilsCrossed size={22} />
          </div>
          <span>Food<span style={{ color: 'var(--primary)' }}>Rescue</span></span>
        </Link>

        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link
            to="/"
            className={`nav-item ${isActive('/') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>

          {user?.role === 'DONOR' && (
            <>
              <Link
                to="/donor"
                className={`nav-item ${isActive('/donor') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/add-food"
                className={`nav-item ${isActive('/add-food') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <PlusCircle size={17} /> Add Donation
              </Link>
              <Link
                to="/my-donations"
                className={`nav-item ${isActive('/my-donations') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Package size={17} /> My Donations
              </Link>
            </>
          )}

          {user?.role === 'ORGANIZATION' && (
            <>
              <Link
                to="/organization"
                className={`nav-item ${isActive('/organization') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Available Surplus
              </Link>
              <Link
                to="/pickups"
                className={`nav-item ${isActive('/pickups') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Truck size={17} /> My Pickups
              </Link>
            </>
          )}

          <Link
            to="/impact"
            className={`nav-item ${isActive('/impact') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <BarChart3 size={17} /> Impact
          </Link>

          <div className="nav-auth-group">
            {user ? (
              <>
                <div className="user-badge">
                  <Building2 size={15} color="#64748b" />
                  <span style={{ fontWeight: 600 }}>{user.name}</span>
                  <span className={`role-pill ${user.role === 'DONOR' ? 'role-donor' : 'role-org'}`}>
                    {user.role}
                  </span>
                </div>
                <button onClick={logout} className="btn btn-secondary btn-sm" title="Log out">
                  <LogOut size={15} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary btn-sm">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
