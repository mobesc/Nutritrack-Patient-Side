import { Link } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import '../styles/patient-mobile.css';

export default function PatientHome() {
  return (
    <div className="mobile-app">
      <div className="mobile-shell">
        <div className="mobile-header">
          <div className="greeting-block">
            <small>Welcome back</small>
            <h2>Ana Dela Cruz</h2>
          </div>
          <div className="avatar-chip">AD</div>
        </div>

        <div className="hero-card">
          <h3>Your care in one mobile view</h3>
          <p>Track your appointment status, access health records, and stay updated with your next visit schedule.</p>
          <div className="hero-meta">
            <span className="meta-pill">📅 Mar 22, 2026</span>
            <span className="meta-pill">⏰ 09:00 AM</span>
            <span className="meta-pill">📍 Barangay Health Center</span>
          </div>
        </div>

        <div className="quick-grid">
            <div className="quick-card"><strong>1</strong><span>Confirmed upcoming appointment</span></div>
            <div className="quick-card"><strong>1</strong><span>Pending status review</span></div>
            <div className="quick-card"><strong>6</strong><span>Health record entries</span></div>
            <div className="quick-card"><strong>2</strong><span>Active medication reminders</span></div>
        </div>

        <div className="section-block">
          <div className="section-header">
            <h3>Upcoming appointments</h3>
            <Link to="/patient-appointments">View all</Link>
          </div>
          <div className="list-card">
            <div className="appointment-list">
              <div className="appointment-item">
                <div className="appointment-item-header">
                  <div>
                    <h4>Prenatal Checkup</h4>
                    <p>Mar 30, 2026 • 09:00 AM</p>
                  </div>
                  <span className="status-pill confirmed">confirmed</span>
                </div>
                <p>Dr. Reyes • Barangay Health Center - Room 2</p>
                <div className="list-tags">
                  <span>Status check available</span>
                  <span>Bring valid ID</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="section-block">
          <div className="section-header">
            <h3>Health record snapshot</h3>
            <Link to="/patient-records">Open records</Link>
          </div>
          <div className="record-card">
            <div className="record-item-header">
              <div>
                <h4>Latest vitals</h4>
                <p>Updated Mar 12, 2026</p>
              </div>
              <span className="inline-pill neutral">Health records</span>
            </div>
            <div className="info-grid">
              <div className="info-cell"><small>Blood Pressure</small><strong>118 / 76</strong></div>
              <div className="info-cell"><small>BMI</small><strong>22.4</strong></div>
              <div className="info-cell"><small>Blood Type</small><strong>O+</strong></div>
              <div className="info-cell"><small>Care Program</small><strong>Maternal Care Program</strong></div>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}