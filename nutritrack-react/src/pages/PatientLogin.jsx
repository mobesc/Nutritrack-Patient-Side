// src/pages/PatientLogin.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import '../styles/patient-mobile.css';

export default function PatientLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    
    if (!email || !password) {
      setErrorMessage('Please enter both email and password');
      setIsLoading(false);
      return;
    }
    
    try {
      // Query patients collection for matching email and password
      const patientsRef = collection(db, 'patients');
      const q = query(patientsRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setErrorMessage('Invalid email or password');
        setIsLoading(false);
        return;
      }
      
      let patientData = null;
      querySnapshot.forEach((doc) => {
        patientData = doc.data();
      });
      
      // Check password
      if (patientData.password !== password) {
        setErrorMessage('Invalid email or password');
        setIsLoading(false);
        return;
      }
      
      // Store patient session
      const patientSession = {
        patient_id: patientData.patient_id,
        name: `${patientData.first_name} ${patientData.last_name}`,
        email: patientData.email,
        isLoggedIn: true
      };
      localStorage.setItem('nutritrack_patient_session', JSON.stringify(patientSession));
      
      navigate('/patient-home');
      
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
          
          {errorMessage && <div className="notice-bar warning">{errorMessage}</div>}
          
          <form className="form-stack" onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <button type="submit" className="primary-btn" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login to Mobile Portal'}
            </button>
          </form>
          
          <div className="auth-footer">
            No patient account yet? <Link className="text-link-btn" to="/patient-signup">Create one here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}