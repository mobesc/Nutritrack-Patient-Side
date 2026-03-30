import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/login.css';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(today.toLocaleDateString('en-US', options));
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    // Bypassing logic for speed, direct to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Left side - Login Form */}
        <div className="login-left">
          <div className="logo-area">
            <h1>NutriTrack</h1>
            <p className="subtitle">Barangay Nutrition Scholar System</p>
          </div>
          
          <h2 className="welcome-text">Welcome Back!</h2>
          <p className="login-instruction">Please login to your account</p>
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input type="text" id="username" name="username" placeholder="Enter your username" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" placeholder="Enter your password" required />
            </div>
            
            <div className="form-options">
              <label className="checkbox-container">
                <input type="checkbox" id="remember" /> Remember me
                <span className="checkmark"></span>
              </label>
              <a href="#" className="forgot-password">Forgot Password?</a>
            </div>
            
            <button type="submit" className="login-btn">Sign In</button>

            <div className="portal-switch">
              <Link to="/patient-login" className="patient-portal-btn">Open Patient Mobile Portal</Link>
              <p>Create a patient account through the <Link to="/patient-signup">mobile sign up page</Link>.</p>
            </div>
          </form>
          
          <div className="date-today">
            Date Today: <span>{currentDate}</span>
          </div>
        </div>
        
        {/* Right side - Illustration */}
        <div className="login-right">
          <div className="illustration-content">
            <div className="illustration-placeholder">
              <div className="placeholder-icon">🏥</div>
              <h3>Barangay Health Center</h3>
              <p>Empowering community health workers with digital tools for better healthcare delivery</p>
            </div>
            <div className="features-list">
              <div className="feature-item"><span className="feature-icon">✓</span><span>Patient Records Management</span></div>
              <div className="feature-item"><span className="feature-icon">✓</span><span>Immunization Tracking</span></div>
              <div className="feature-item"><span className="feature-icon">✓</span><span>Prenatal Monitoring</span></div>
              <div className="feature-item"><span className="feature-icon">✓</span><span>Nutrition Status Tracking</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}