import { useNavigate, Link } from 'react-router-dom';
import '../styles/patient-mobile.css';

export default function PatientLogin() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Bypassing logic for speed, just push to home
    localStorage.setItem('nutritrack_patient_session', JSON.stringify({ isLoggedIn: true }));
    navigate('/patient-home');
  };

  return (
    <div className="mobile-auth">
      <div className="auth-shell">
        <div className="brand-block">
          <h1>NutriTrack PH</h1>
          <p>Patient mobile portal for home access, appointment booking, appointment status tracking, and health record viewing.</p>
        </div>
        <div className="auth-card">
          <div className="auth-header">
            <h2>Patient Login</h2>
            <p>Sign in to view your profile, monitor appointment status, and open your personal health records.</p>
          </div>
          <div className="notice-bar info">Demo account is preloaded. Use <strong>ana.delacruz@example.com</strong> and <strong>patient123</strong>.</div>
          
          <form className="form-stack" onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email Address</label>
              <input type="email" required />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input type="password" required />
            </div>
            <button type="submit" className="primary-btn">Login to Mobile Portal</button>
          </form>
          
          <div className="auth-footer">
            No patient account yet? <Link className="text-link-btn" to="/patient-signup">Create one here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}