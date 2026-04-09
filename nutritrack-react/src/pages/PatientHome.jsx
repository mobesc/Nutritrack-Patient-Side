// src/pages/PatientHome.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { db } from '../firebase/config';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import '../styles/patient-mobile.css';

export default function PatientHome() {
  const [patientData, setPatientData] = useState(null);
  const [childrenRecord, setChildrenRecord] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [checkups, setCheckups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllPatientData();
  }, []);

  const loadAllPatientData = async () => {
    setLoading(true);
    
    try {
      // Get patient session
      const session = localStorage.getItem('nutritrack_patient_session');
      console.log('Session:', session);
      
      if (!session) {
        console.log('No session found');
        setLoading(false);
        return;
      }
      
      const patientSession = JSON.parse(session);
      const patientId = patientSession.patient_id;
      console.log('Loading data for patient ID:', patientId);
      console.log('Patient ID type:', typeof patientId);
      
      // 1. Load patient info
      const patientsRef = collection(db, 'patients');
      const patientQuery = query(patientsRef, where('patient_id', '==', patientId));
      const patientSnapshot = await getDocs(patientQuery);
      
      let patientInfo = null;
      patientSnapshot.forEach((doc) => {
        patientInfo = { ...doc.data(), docId: doc.id };
      });
      
      if (!patientInfo) {
        console.log('Patient not found');
        setLoading(false);
        return;
      }
      
      setPatientData(patientInfo);
      console.log('Patient loaded:', patientInfo.first_name, patientInfo.last_name);
      
      // 2. Load children record
      if (patientInfo.patient_type === 'Child') {
        const childrenRef = collection(db, 'children_records');
        const childrenQuery = query(childrenRef, where('patient_id', '==', patientId));
        const childrenSnapshot = await getDocs(childrenQuery);
        
        let childRecord = null;
        childrenSnapshot.forEach((doc) => {
          childRecord = doc.data();
        });
        setChildrenRecord(childRecord);
        console.log('Children record:', childRecord);
      }
      
      // 3. Load appointments - using patient_id as string
      const appointmentsRef = collection(db, 'appointments');
      const appointmentsQuery = query(
        appointmentsRef, 
        where('patient_id', '==', patientId)
      );
      const appointmentsSnapshot = await getDocs(appointmentsQuery);
      
      const appointmentsList = [];
      appointmentsSnapshot.forEach((doc) => {
        appointmentsList.push({ ...doc.data(), id: doc.id });
      });
      setAppointments(appointmentsList);
      console.log('Appointments found:', appointmentsList.length);
      console.log('Appointment details:', appointmentsList);
      
      // 4. Load medical history
      const medicalRef = collection(db, 'medical_history');
      const medicalQuery = query(medicalRef, where('patient_id', '==', patientId));
      const medicalSnapshot = await getDocs(medicalQuery);
      const medicalList = [];
      medicalSnapshot.forEach((doc) => {
        medicalList.push({ ...doc.data(), id: doc.id });
      });
      setMedicalHistory(medicalList);
      console.log('Medical history:', medicalList.length);
      
      // 5. Load pregnancy checkups
      if (patientInfo.patient_type === 'Pregnant') {
        const checkupsRef = collection(db, 'pregnancy_checkups');
        const checkupsQuery = query(checkupsRef, where('patient_id', '==', patientId));
        const checkupsSnapshot = await getDocs(checkupsQuery);
        const checkupsList = [];
        checkupsSnapshot.forEach((doc) => {
          checkupsList.push({ ...doc.data(), id: doc.id });
        });
        setCheckups(checkupsList);
        console.log('Checkups:', checkupsList.length);
      }
      
    } catch (error) {
      console.error('Error loading patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get weight and height from children_records
  const getChildMeasurements = () => {
    if (!childrenRecord) {
      return { weight: '--', height: '--', bmi: '--' };
    }
    
    const weight = childrenRecord.birth_weight || '--';
    const height = childrenRecord.birth_height || '--';
    
    let bmi = '--';
    if (weight !== '--' && height !== '--') {
      const weightNum = parseFloat(weight);
      const heightNum = parseFloat(height) / 100;
      if (!isNaN(weightNum) && !isNaN(heightNum) && heightNum > 0) {
        const bmiValue = weightNum / (heightNum * heightNum);
        bmi = bmiValue.toFixed(1);
      }
    }
    
    return { weight, height, bmi };
  };

  // Get blood pressure
  const getBloodPressure = () => {
    if (checkups.length > 0) {
      const sortedCheckups = [...checkups].sort((a, b) => 
        new Date(b.checkup_date) - new Date(a.checkup_date)
      );
      const latestCheckup = sortedCheckups[0];
      if (latestCheckup.blood_pressure) {
        return latestCheckup.blood_pressure;
      }
    }
    return '-- / --';
  };

  // Get next appointment
  const getNextAppointment = () => {
    const today = new Date().toISOString().split('T')[0];
    const futureAppointments = appointments
      .filter(a => a.appointment_date >= today && (a.status === 'Confirmed' || a.status === 'Scheduled'))
      .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date));
    
    console.log('Future appointments:', futureAppointments);
    return futureAppointments[0] || null;
  };

  // Get past appointments
  const getPastAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    return appointments
      .filter(a => a.appointment_date < today || a.status === 'Completed' || a.status === 'Cancelled')
      .sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date))
      .slice(0, 3);
  };

  // Get active medical conditions
  const getActiveConditions = () => {
    return medicalHistory.filter(m => m.status === 'Ongoing').slice(0, 3);
  };

  const childMeasurements = getChildMeasurements();
  const bloodPressure = getBloodPressure();
  const nextAppointment = getNextAppointment();
  const pastAppointments = getPastAppointments();
  const activeConditions = getActiveConditions();
  const upcomingCount = appointments.filter(a => a.status === 'Confirmed' || a.status === 'Scheduled').length;
  
  const getInitials = () => {
    if (!patientData) return 'PT';
    const first = patientData.first_name?.charAt(0) || '';
    const last = patientData.last_name?.charAt(0) || '';
    return (first + last).toUpperCase();
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="mobile-app">
        <div className="mobile-shell" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
            <p>Loading your health data...</p>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="mobile-app">
      <div className="mobile-shell">
        {/* Header */}
        <div className="mobile-header">
          <div className="greeting-block">
            <small>Welcome back</small>
            <h2>{patientData?.first_name} {patientData?.last_name}</h2>
            <small style={{ color: '#2B6896' }}>ID: {patientData?.patient_id} • {patientData?.patient_type || 'General'}</small>
          </div>
          <div className="avatar-chip">{getInitials()}</div>
        </div>

        {/* Next Appointment Hero Card */}
        {nextAppointment ? (
          <div className="hero-card">
            <h3>📋 Next Appointment</h3>
            <p><strong>{nextAppointment.purpose || 'Medical Consultation'}</strong></p>
            <div className="hero-meta">
              <span className="meta-pill">📅 {formatDate(nextAppointment.appointment_date)}</span>
              <span className="meta-pill">⏰ {nextAppointment.appointment_time || 'TBD'}</span>
              <span className="meta-pill">📍 Barangay Health Center</span>
            </div>
            {nextAppointment.remarks && (
              <p style={{ marginTop: '12px', fontSize: '13px', opacity: 0.9 }}>📝 {nextAppointment.remarks}</p>
            )}
          </div>
        ) : (
          <div className="hero-card" style={{ background: 'linear-gradient(135deg, #6c757d 0%, #adb5bd 100%)' }}>
            <h3>📅 No Upcoming Appointments</h3>
            <p>Book an appointment through the appointments tab.</p>
            <Link to="/patient-appointments" style={{ color: 'white', textDecoration: 'underline', marginTop: '10px', display: 'inline-block' }}>
              Schedule now →
            </Link>
          </div>
        )}

        {/* Vital Signs Card */}
        <div className="section-block">
          <div className="section-header">
            <h3>📊 Vital Signs</h3>
          </div>
          <div className="record-card">
            <div className="info-grid">
              <div className="info-cell">
                <small>Blood Pressure</small>
                <strong>{bloodPressure}</strong>
              </div>
              <div className="info-cell">
                <small>Weight</small>
                <strong>{childMeasurements.weight !== '--' ? `${childMeasurements.weight} kg` : 'Not recorded'}</strong>
              </div>
              <div className="info-cell">
                <small>Height</small>
                <strong>{childMeasurements.height !== '--' ? `${childMeasurements.height} cm` : 'Not recorded'}</strong>
              </div>
              <div className="info-cell">
                <small>BMI</small>
                <strong>{childMeasurements.bmi !== '--' ? childMeasurements.bmi : 'N/A'}</strong>
              </div>
              <div className="info-cell">
                <small>Blood Type</small>
                <strong>{patientData?.blood_type || 'Not recorded'}</strong>
              </div>
              <div className="info-cell">
                <small>Patient Type</small>
                <strong>{patientData?.patient_type || 'General'}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="quick-grid">
          <div className="quick-card">
            <strong>{upcomingCount}</strong>
            <span>Upcoming appointments</span>
          </div>
          <div className="quick-card">
            <strong>{activeConditions.length}</strong>
            <span>Active conditions</span>
          </div>
          <div className="quick-card">
            <strong>{medicalHistory.length + (checkups.length || 0)}</strong>
            <span>Total records</span>
          </div>
          <div className="quick-card">
            <strong>{pastAppointments.length}</strong>
            <span>Past visits</span>
          </div>
        </div>

        {/* Upcoming Appointments List */}
        {upcomingCount > 0 && (
          <div className="section-block">
            <div className="section-header">
              <h3>📅 Upcoming Appointments</h3>
              <Link to="/patient-appointments">View all</Link>
            </div>
            <div className="list-card">
              {appointments
                .filter(a => a.status === 'Confirmed' || a.status === 'Scheduled')
                .map((app, idx) => (
                  <div className="appointment-item" key={idx}>
                    <div className="appointment-item-header">
                      <div>
                        <h4>{app.purpose || 'Medical Consultation'}</h4>
                        <p>{formatDate(app.appointment_date)} • {app.appointment_time || 'Time TBD'}</p>
                      </div>
                      <span className={`status-pill ${app.status === 'Confirmed' ? 'confirmed' : 'pending'}`}>
                        {app.status?.toLowerCase() || 'scheduled'}
                      </span>
                    </div>
                    {app.remarks && <p className="text-muted">📝 {app.remarks}</p>}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Medical Conditions */}
        {activeConditions.length > 0 && (
          <div className="section-block">
            <div className="section-header">
              <h3>🏥 Medical Conditions</h3>
              <Link to="/patient-records">View all</Link>
            </div>
            <div className="list-card">
              {activeConditions.map((condition, idx) => (
                <div className="appointment-item" key={idx}>
                  <div className="appointment-item-header">
                    <div>
                      <h4>{condition.condition}</h4>
                      <p>Since {formatDate(condition.diagnosis_date)}</p>
                    </div>
                    <span className="status-pill pending">ongoing</span>
                  </div>
                  {condition.treatment_notes && <p className="text-muted">{condition.treatment_notes}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Past Appointments */}
        {pastAppointments.length > 0 && (
          <div className="section-block">
            <div className="section-header">
              <h3>📋 Recent Visits</h3>
              <Link to="/patient-appointments">View all</Link>
            </div>
            <div className="list-card">
              {pastAppointments.map((app, idx) => (
                <div className="appointment-item" key={idx}>
                  <div className="appointment-item-header">
                    <div>
                      <h4>{app.purpose || 'Medical Consultation'}</h4>
                      <p>{formatDate(app.appointment_date)}</p>
                    </div>
                    <span className={`status-pill ${app.status === 'Completed' ? 'completed' : 'cancelled'}`}>
                      {app.status?.toLowerCase() || 'completed'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Health Tips */}
        <div className="section-block">
          <div className="section-header">
            <h3>💡 Health Reminders</h3>
          </div>
          <div className="record-card">
            <div className="list-tags">
              {patientData?.patient_type === 'Child' && (
                <>
                  <span>💉 Complete immunization schedule</span>
                  <span>🩺 Regular check-ups</span>
                  <span>🥦 Balanced nutrition</span>
                  <span>📏 Track growth regularly</span>
                </>
              )}
              {patientData?.patient_type === 'Pregnant' && (
                <>
                  <span>🤰 Take prenatal vitamins daily</span>
                  <span>💧 Stay hydrated</span>
                  <span>🩺 Monitor fetal movement</span>
                </>
              )}
              {patientData?.patient_type === 'Senior' && (
                <>
                  <span>💊 Take medications on time</span>
                  <span>🚶 Light exercise daily</span>
                  <span>🩸 Regular BP monitoring</span>
                </>
              )}
              {(patientData?.patient_type === 'General' || !patientData?.patient_type) && (
                <>
                  <span>🥗 Eat balanced meals</span>
                  <span>🏃 Exercise regularly</span>
                  <span>💧 Stay hydrated</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}