// src/pages/PatientAppointments.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { db } from '../firebase/config';
import { collection, query, where, getDocs, addDoc, orderBy } from 'firebase/firestore';
import '../styles/patient-mobile.css';

export default function PatientAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [patientId, setPatientId] = useState(null);
  const [patientName, setPatientName] = useState('');
  
  const [formData, setFormData] = useState({
    purpose: '',
    doctorName: '',
    appointmentDate: '',
    appointmentTime: '',
    remarks: ''
  });

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    
    try {
      const session = localStorage.getItem('nutritrack_patient_session');
      if (!session) {
        navigate('/patient-login');
        return;
      }
      
      const patientSession = JSON.parse(session);
      const pid = patientSession.patient_id;
      const pname = patientSession.name;
      
      setPatientId(pid);
      setPatientName(pname);
      
      console.log('Loading appointments for patient ID:', pid);
      
      const appointmentsRef = collection(db, 'appointments');
      const q = query(appointmentsRef, where('patient_id', '==', String(pid)));
      const querySnapshot = await getDocs(q);
      
      const appointmentsList = [];
      querySnapshot.forEach((doc) => {
        appointmentsList.push({ ...doc.data(), id: doc.id });
      });
      
      setAppointments(appointmentsList);
      console.log('Appointments loaded:', appointmentsList.length);
      console.log('Appointment details:', appointmentsList);
      
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateAppointmentId = async () => {
    try {
      const appointmentsRef = collection(db, 'appointments');
      const querySnapshot = await getDocs(appointmentsRef);
      const maxId = Math.max(
        ...querySnapshot.docs.map(doc => {
          const id = doc.data().appointment_id;
          const num = parseInt(id.replace('A', ''));
          return isNaN(num) ? 0 : num;
        }),
        0
      );
      const nextNum = maxId + 1;
      return `A${String(nextNum).padStart(3, '0')}`;
    } catch (error) {
      return `A${Date.now()}`;
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    
    if (!formData.purpose || !formData.doctorName || !formData.appointmentDate || !formData.appointmentTime) {
      alert('Please fill in all required fields');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const appointmentId = await generateAppointmentId();
      
      const newAppointment = {
        appointment_id: appointmentId,
        patient_id: String(patientId),
        patient_name: patientName,
        appointment_date: formData.appointmentDate,
        appointment_time: formData.appointmentTime,
        purpose: formData.purpose,
        status: 'Pending',
        priority: 'Normal',
        doctor_name: formData.doctorName,
        remarks: formData.remarks || '',
        created_at: new Date().toISOString(),
        created_via: 'mobile_app'
      };
      
      console.log('Saving appointment:', newAppointment);
      
      const appointmentsRef = collection(db, 'appointments');
      await addDoc(appointmentsRef, newAppointment);
      
      alert(`Appointment request submitted! Your appointment ID is: ${appointmentId}`);
      
      setFormData({
        purpose: '',
        doctorName: '',
        appointmentDate: '',
        appointmentTime: '',
        remarks: ''
      });
      
      await loadAppointments();
      
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Error booking appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate stats
  const totalBookings = appointments.length;
  const confirmedCount = appointments.filter(a => a.status === 'Confirmed').length;
  const pendingCount = appointments.filter(a => a.status === 'Pending').length;
  const completedCount = appointments.filter(a => a.status === 'Completed').length;
  
  // Get today's date in YYYY-MM-DD format for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];
  
  // Upcoming appointments (future dates with Confirmed or Scheduled status)
  const upcomingAppointments = appointments
    .filter(a => {
      const appointmentDate = new Date(a.appointment_date);
      appointmentDate.setHours(0, 0, 0, 0);
      return appointmentDate >= today && (a.status === 'Confirmed' || a.status === 'Scheduled');
    })
    .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date));
  
  // Pending appointments (any status Pending)
  const pendingAppointments = appointments
    .filter(a => a.status === 'Pending')
    .sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date));
  
  // Past appointments (past dates or Completed/Cancelled status)
  const pastAppointments = appointments
    .filter(a => {
      const appointmentDate = new Date(a.appointment_date);
      appointmentDate.setHours(0, 0, 0, 0);
      return appointmentDate < today || a.status === 'Completed' || a.status === 'Cancelled';
    })
    .sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date));

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getInitials = () => {
    if (!patientName) return 'PT';
    const names = patientName.split(' ');
    if (names.length >= 2) {
      return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
    }
    return patientName.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className="mobile-app">
        <div className="mobile-shell" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
            <p>Loading your appointments...</p>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="mobile-app">
      <div className="mobile-shell">
        <div className="mobile-header">
          <div className="greeting-block">
            <small>Appointment center</small>
            <h2>Booking & Status</h2>
          </div>
          <div className="avatar-chip">{getInitials()}</div>
        </div>

        <div className="notice-bar info">
          📋 View your upcoming appointments, check status, or book a new one.
        </div>

        {/* Summary Stats */}
        <div className="summary-grid">
          <div className="summary-card">
            <strong>{totalBookings}</strong>
            <span>Total bookings</span>
          </div>
          <div className="summary-card">
            <strong>{confirmedCount}</strong>
            <span>Confirmed</span>
          </div>
          <div className="summary-card">
            <strong>{pendingCount}</strong>
            <span>Pending review</span>
          </div>
          <div className="summary-card">
            <strong>{completedCount}</strong>
            <span>Completed visits</span>
          </div>
        </div>

        {/* Upcoming Appointments Section */}
        {upcomingAppointments.length > 0 && (
          <div className="section-block">
            <div className="section-header">
              <h3>📅 Upcoming Appointments</h3>
            </div>
            <div className="list-card">
              <div className="appointment-list">
                {upcomingAppointments.map((app) => (
                  <div className="appointment-item" key={app.id}>
                    <div className="appointment-item-header">
                      <div>
                        <h4>{app.purpose || 'Medical Consultation'}</h4>
                        <p>{formatDate(app.appointment_date)} • {app.appointment_time || 'Time TBD'}</p>
                      </div>
                      <span className={`status-pill ${app.status === 'Confirmed' ? 'confirmed' : 'pending'}`}>
                        {app.status?.toLowerCase() || 'scheduled'}
                      </span>
                    </div>
                    {app.doctor_name && <p>👨‍⚕️ {app.doctor_name}</p>}
                    {app.remarks && <p className="text-muted">📝 {app.remarks}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pending Appointments Section */}
        {pendingAppointments.length > 0 && (
          <div className="section-block">
            <div className="section-header">
              <h3>⏳ Pending Requests</h3>
            </div>
            <div className="list-card">
              <div className="appointment-list">
                {pendingAppointments.map((app) => (
                  <div className="appointment-item" key={app.id}>
                    <div className="appointment-item-header">
                      <div>
                        <h4>{app.purpose || 'Medical Consultation'}</h4>
                        <p>{formatDate(app.appointment_date)} • {app.appointment_time || 'Time TBD'}</p>
                      </div>
                      <span className="status-pill pending">pending</span>
                    </div>
                    {app.doctor_name && <p>👨‍⚕️ {app.doctor_name}</p>}
                    <p className="text-muted">⏰ Status awaiting confirmation from the health center.</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Book an Appointment Form */}
        <div className="section-block">
          <div className="section-header">
            <h3>📝 Book an Appointment</h3>
          </div>
          <div className="form-card">
            <div className="notice-bar info">
              Choose a service, date, and preferred time. New requests are marked as pending.
            </div>
            <form className="form-stack" onSubmit={handleBookAppointment}>
              <div className="field-row">
                <div className="input-group">
                  <label>Service *</label>
                  <select name="purpose" value={formData.purpose} onChange={handleFormChange} required>
                    <option value="">Select service</option>
                    <option value="Prenatal Checkup">Prenatal Checkup</option>
                    <option value="General Consultation">General Consultation</option>
                    <option value="Child Immunization">Child Immunization</option>
                    <option value="Nutrition Consultation">Nutrition Consultation</option>
                    <option value="Follow-up Checkup">Follow-up Checkup</option>
                    <option value="Senior Checkup">Senior Checkup</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Preferred Provider *</label>
                  <select name="doctorName" value={formData.doctorName} onChange={handleFormChange} required>
                    <option value="">Select provider</option>
                    <option value="Dr. Reyes">Dr. Reyes</option>
                    <option value="Dr. Filio">Dr. Filio</option>
                    <option value="Nurse Santos">Nurse Santos</option>
                    <option value="Nutritionist Cruz">Nutritionist Cruz</option>
                  </select>
                </div>
              </div>

              <div className="field-row">
                <div className="input-group">
                  <label>Date *</label>
                  <input 
                    type="date" 
                    name="appointmentDate" 
                    value={formData.appointmentDate} 
                    onChange={handleFormChange}
                    min={todayStr}
                    required 
                  />
                </div>
                <div className="input-group">
                  <label>Time *</label>
                  <input 
                    type="time" 
                    name="appointmentTime" 
                    value={formData.appointmentTime} 
                    onChange={handleFormChange}
                    required 
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Reason / Notes</label>
                <textarea 
                  name="remarks" 
                  placeholder="Add symptoms, concerns, or reminders..." 
                  value={formData.remarks}
                  onChange={handleFormChange}
                  rows="3"
                ></textarea>
              </div>

              <button type="submit" className="primary-btn" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Appointment Request'}
              </button>
            </form>
          </div>
        </div>

        {/* Appointment History */}
        {pastAppointments.length > 0 && (
          <div className="section-block">
            <div className="section-header">
              <h3>📋 Appointment History</h3>
            </div>
            <div className="list-card">
              <div className="timeline-list">
                {pastAppointments.map((app) => (
                  <div className="timeline-item" key={app.id}>
                    <div className="appointment-item-header">
                      <div>
                        <h4>{app.purpose || 'Medical Consultation'}</h4>
                        <p>{formatDate(app.appointment_date)} • {app.appointment_time || 'Time TBD'}</p>
                      </div>
                      <span className={`status-pill ${app.status === 'Completed' ? 'completed' : 'cancelled'}`}>
                        {app.status?.toLowerCase() || 'completed'}
                      </span>
                    </div>
                    {app.doctor_name && <p>👨‍⚕️ {app.doctor_name}</p>}
                    {app.remarks && <p className="text-muted">{app.remarks}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {appointments.length === 0 && (
          <div className="section-block">
            <div className="list-card">
              <div className="empty-state">
                <p>📅 No appointments yet</p>
                <p style={{ fontSize: '12px', marginTop: '8px' }}>Book your first appointment using the form above.</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}