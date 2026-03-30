import { Link, useNavigate } from 'react-router-dom';
import '../styles/patient-mobile.css';

export default function PatientSignup() {
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    // Bypass logic for speed, instantly log them in
    localStorage.setItem('nutritrack_patient_session', JSON.stringify({ isLoggedIn: true }));
    navigate('/patient-home');
  };

  return (
    <div className="mobile-auth">
      <div className="auth-shell">
        <div className="brand-block">
          <h1>Create Patient Profile</h1>
          <p>Register once so patients can use the mobile portal to book appointments, review health updates, and maintain their profile.</p>
        </div>

        <div className="auth-card">
          <div className="auth-header">
            <h2>Patient Sign Up</h2>
            <p>This form creates the patient-facing mobile profile while keeping the existing staff portal separate.</p>
          </div>

          <div className="notice-bar info">Complete the fields below to build the patient account.</div>

          <form className="form-stack" onSubmit={handleSignup}>
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" placeholder="Juan Dela Cruz" required />
            </div>

            <div className="field-row">
              <div className="input-group">
                <label>Email</label>
                <input type="email" placeholder="name@example.com" required />
              </div>
              <div className="input-group">
                <label>Phone</label>
                <input type="text" placeholder="09xx xxx xxxx" required />
              </div>
            </div>

            <div className="field-row">
              <div className="input-group">
                <label>Password</label>
                <input type="password" placeholder="Create password" required />
              </div>
              <div className="input-group">
                <label>Birthday</label>
                <input type="date" required />
              </div>
            </div>

            <div className="input-group">
              <label>Address</label>
              <textarea placeholder="Barangay / street / purok" required></textarea>
            </div>

            <button type="submit" className="primary-btn">Create Mobile Account</button>
          </form>

          <div className="auth-footer">
            Already registered? <Link className="text-link-btn" to="/patient-login">Go to login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}