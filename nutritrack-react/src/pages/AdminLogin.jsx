// src/pages/AdminLogin.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import '../styles/login.css';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(today.toLocaleDateString('en-US', options));
    
    // Check for remembered user
    const rememberedUser = localStorage.getItem('rememberedAdminUser');
    if (rememberedUser) {
      setUsername(rememberedUser);
      setRememberMe(true);
    }
  }, []);

  // Validate user against User Maintenance collection
  const validateUser = async (username, password) => {
    try {
      // Query the users collection for matching username
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return { valid: false, message: 'Invalid username or password' };
      }
      
      let userData = null;
      let docId = null;
      
      querySnapshot.forEach((doc) => {
        userData = doc.data();
        docId = doc.id;
      });
      
      // Check password
      if (userData.password !== password) {
        return { valid: false, message: 'Invalid username or password' };
      }
      
      // Check if user is active (if status field exists)
      if (userData.status === 'Inactive') {
        return { valid: false, message: 'Your account is inactive. Please contact administrator.' };
      }
      
      return { 
        valid: true, 
        user: userData, 
        docId: docId,
        message: 'Login successful' 
      };
      
    } catch (error) {
      console.error('Error validating user:', error);
      return { valid: false, message: 'Database error. Please try again.' };
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    
    if (!username || !password) {
      setErrorMessage('Please enter both username and password');
      setIsLoading(false);
      return;
    }
    
    try {
      // Validate user against User Maintenance
      const result = await validateUser(username, password);
      
      if (!result.valid) {
        setErrorMessage(result.message);
        setIsLoading(false);
        return;
      }
      
      const userData = result.user;
      
      // Prepare session data
      const sessionUser = {
        uid: result.docId,
        user_id: userData.user_id,
        username: userData.username,
        name: userData.name,
        position: userData.position,
        department: userData.department,
        access_level: userData.access_level,
        role: userData.access_level,
        staff_id: userData.staff_id,
        login_time: new Date().toISOString()
      };
      
      // Store in session storage
      sessionStorage.setItem('currentUser', JSON.stringify(sessionUser));
      
      // Handle remember me
      if (rememberMe) {
        localStorage.setItem('rememberedAdminUser', username);
      } else {
        localStorage.removeItem('rememberedAdminUser');
      }
      
      // Redirect to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
              <input 
                type="text" 
                id="username" 
                name="username" 
                placeholder="Enter your username" 
                required 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                placeholder="Enter your password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            
            <div className="form-options">
              <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  id="remember" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                /> 
                Remember me
                <span className="checkmark"></span>
              </label>
              <a href="#" className="forgot-password">Forgot Password?</a>
            </div>
            
            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Sign In'}
            </button>
            
            {errorMessage && <div className="error-message">{errorMessage}</div>}

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