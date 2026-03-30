import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="bottom-nav">
      <Link to="/patient-home" className={isActive('/patient-home')}><span className="nav-icon">🏠</span><span>Home</span></Link>
      <Link to="/patient-appointments" className={isActive('/patient-appointments')}><span className="nav-icon">📅</span><span>Appointments</span></Link>
      <Link to="/patient-records" className={isActive('/patient-records')}><span className="nav-icon">📋</span><span>Records</span></Link>
      <Link to="/patient-profile" className={isActive('/patient-profile')}><span className="nav-icon">👤</span><span>Profile</span></Link>
    </nav>
  );
}