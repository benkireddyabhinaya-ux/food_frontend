import React from 'react';
import { UtensilsCrossed, Heart, Globe, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
          <div style={{ maxWidth: '360px' }}>
            <div className="brand-link" style={{ marginBottom: '0.75rem' }}>
              <div className="brand-icon" style={{ width: '32px', height: '32px' }}>
                <UtensilsCrossed size={18} />
              </div>
              <span>Food<span style={{ color: 'var(--primary)' }}>Rescue</span></span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Empowering communities to reduce edible food waste by seamlessly connecting restaurants,
              supermarkets, and food donors with charitable distribution organizations.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.75rem', color: 'var(--text-main)' }}>Platform</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <li><a href="/">Live Surplus Feed</a></li>
                <li><a href="/impact">Environmental Impact</a></li>
                <li><a href="/login">Donor Portal</a></li>
                <li><a href="/login">NGO Partners</a></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.75rem', color: 'var(--text-main)' }}>Tech Stack</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span>☕ Java 21 / Spring Boot 3.5</span>
                <span>🐘 PostgreSQL Database</span>
                <span>⚡ React 19 + Vite Frontend</span>
                <span>☁️ Hosted on Render + Vercel</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} Food Waste Reduction System. Open Source Initiative.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>Made with</span>
            <Heart size={14} color="#dc2626" fill="#dc2626" />
            <span>for zero food hunger & waste reduction</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
