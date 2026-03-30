import BottomNav from '../components/BottomNav';
import { Link } from 'react-router-dom';
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
        </div>

        <div className="quick-grid">
            <div className="quick-card"><strong>0</strong><span>Confirmed upcoming appointment</span></div>
            <div className="quick-card"><strong>0</strong><span>Pending status review</span></div>
            <div className="quick-card"><strong>0</strong><span>Health record entries</span></div>
            <div className="quick-card"><strong>0</strong><span>Active medication reminders</span></div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}