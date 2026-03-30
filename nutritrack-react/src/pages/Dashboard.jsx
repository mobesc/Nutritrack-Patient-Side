import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import '../styles/dashboard.css';

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    const ctx = chartRef.current;
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Children', 'Pregnant', 'Senior', 'General'],
          datasets: [{
            data: [567, 89, 210, 368],
            backgroundColor: ['#2B6896', '#4A90E2', '#6C8EB2', '#95B8D1'],
            borderColor: 'white',
            borderWidth: 2,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    }
    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, []);

  const toggleSubmenu = (menu) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="app-container">
      
      <div className="app-header">
        <div className="header-left">
          <button className="sidebar-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>☰</button>
          <h1>NutriTrack PH</h1>
        </div>
        <div className="search-container">
          <input type="text" placeholder="Search patients, records..." />
          <button className="search-btn">🔍</button>
        </div>
        <div className="user-profile">
          <span className="user-name">Maria Santos</span>
          <div className="avatar">👤</div>
        </div>
      </div>
      
      <div className="main-content">
        
        <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-header">
            <h3>Menu</h3>
          </div>
          <ul className="sidebar-menu">
            <li className="active"><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/dashboard">Patients</Link></li>
            
            <li className="has-submenu">
              <a href="#" onClick={(e) => { e.preventDefault(); toggleSubmenu('checkups'); }}>Checkups ▼</a>
              <ul className={`submenu ${activeSubmenu === 'checkups' ? 'show' : ''}`}>
                <li><Link to="/dashboard">Patient Checkups</Link></li>
                <li><Link to="/dashboard">Pregnancy Checkups</Link></li>
              </ul>
            </li>
            
            <li><Link to="/dashboard">Appointment Scheduling</Link></li>
            <li><Link to="/dashboard">Child Immunizations</Link></li>
          </ul>
          
          <div className="sidebar-footer">
            <a href="#" onClick={handleLogout} className="logout-link">Logout</a>
          </div>
        </div>
        
        <div className={`content-area ${sidebarCollapsed ? 'expanded' : ''}`}>
          <h2 className="page-title">NUTRITRACK DASHBOARD</h2>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ fontSize: '40px' }}>👥</div>
              <div className="stat-details">
                <div className="stat-value">1,234</div>
                <div className="stat-label">Total Patients</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ fontSize: '40px' }}>👶</div>
              <div className="stat-details">
                <div className="stat-value">567</div>
                <div className="stat-label">Total Children</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ fontSize: '40px' }}>🤰</div>
              <div className="stat-details">
                <div className="stat-value">89</div>
                <div className="stat-label">Pregnant Women</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ fontSize: '40px' }}>👵</div>
              <div className="stat-details">
                <div className="stat-value">210</div>
                <div className="stat-label">Senior Citizens</div>
              </div>
            </div>
          </div>
          
          <div className="charts-calendar-row">
            <div className="chart-container">
              <h3>Patient Statistics</h3>
              <div className="month-display">Month of March 2026</div>
              <div className="pie-chart-wrapper" style={{ position: 'relative', height: '250px' }}>
                <canvas ref={chartRef}></canvas>
              </div>
              <div className="pie-legend">
                <div className="legend-item"><span className="legend-color" style={{ background: '#2B6896' }}></span><span>Children: 567 (46%)</span></div>
                <div className="legend-item"><span className="legend-color" style={{ background: '#4A90E2' }}></span><span>Pregnant: 89 (7%)</span></div>
                <div className="legend-item"><span className="legend-color" style={{ background: '#6C8EB2' }}></span><span>Senior: 210 (17%)</span></div>
                <div className="legend-item"><span className="legend-color" style={{ background: '#95B8D1' }}></span><span>General: 368 (30%)</span></div>
              </div>
            </div>
            
            <div className="calendar-container">
              <h3>Calendar View</h3>
              <div className="calendar-header">
                <button className="calendar-nav">◀</button>
                <span>March 2026</span>
                <button className="calendar-nav">▶</button>
              </div>
              <div className="calendar-weekdays">
                <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
              </div>
              <div className="calendar-days">
                <div className="day">1</div><div className="day">2</div><div className="day">3</div><div className="day">4</div><div className="day">5</div><div className="day">6</div><div className="day">7</div>
                <div className="day">8</div><div className="day">9</div><div className="day">10</div><div className="day">11</div><div className="day">12</div><div className="day">13</div><div className="day">14</div>
                <div className="day">15</div><div className="day">16</div><div className="day">17</div><div className="day">18</div><div className="day today">19</div><div className="day">20</div><div className="day">21</div>
              </div>
              <div className="calendar-events">
                <div className="event-item">• 09:00 AM - Prenatal Checkup</div>
                <div className="event-item">• 10:30 AM - Child Immunization</div>
              </div>
            </div>
          </div>
          
          <div className="table-container">
            <h3>Patient Overview</h3>
            <table className="patient-table">
              <thead>
                <tr>
                  <th>ID</th><th>Name</th><th>Age</th><th>Gender</th><th>Type</th><th>Status</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>1001</td><td>Juan Dela Cruz</td><td>5</td><td>Male</td><td>Child</td><td><span className="status completed">Completed</span></td><td><button className="view-btn">View</button></td></tr>
                <tr><td>1002</td><td>Maria Santos</td><td>28</td><td>Female</td><td>Pregnant</td><td><span className="status pending">Pending</span></td><td><button className="view-btn">View</button></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}