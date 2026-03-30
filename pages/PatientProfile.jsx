import BottomNav from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';
import '../styles/patient-mobile.css';

export default function PatientProfile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('nutritrack_patient_session');
    navigate('/patient-login');
  };

  return (
    <div className="mobile-app">
      <div className="mobile-shell">
        <div className="mobile-header">
          <div className="greeting-block">
            <small>Account settings</small>
            <h2>My Profile</h2>
          </div>
          <div className="avatar-chip">AD</div>
        </div>

        <div className="profile-card">
          <div className="profile-meta">
            <div className="avatar-chip" style={{ width: '56px', height: '56px' }}>AD</div>
            <div className="profile-meta-text">
              <h3>Ana Dela Cruz</h3>
              <p>Patient ID: PT-2026-001</p>
            </div>
          </div>

          <div className="notice-bar info">Update the patient profile here. The mobile records view uses this information.</div>

          <form className="form-stack" onSubmit={(e) => { e.preventDefault(); alert("Profile Saved!"); }}>
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" defaultValue="Ana Dela Cruz" required />
            </div>
            <div className="field-row">
              <div className="input-group">
                <label>Email</label>
                <input type="email" defaultValue="ana.delacruz@example.com" required />
              </div>
              <div className="input-group">
                <label>Phone</label>
                <input type="text" defaultValue="0917 123 4567" required />
              </div>
            </div>
            <div className="input-group">
              <label>Address</label>
              <textarea defaultValue="Purok 3, Barangay San Isidro" required></textarea>
            </div>
            
            <div className="inline-actions">
              <button type="submit" className="primary-btn">Save Profile</button>
              <button type="button" onClick={handleLogout} className="secondary-btn">Logout</button>
            </div>
          </form>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}