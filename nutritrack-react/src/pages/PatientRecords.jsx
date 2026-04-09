// src/pages/PatientRecords.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { db } from '../firebase/config';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import '../styles/patient-mobile.css';

export default function PatientRecords() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState(null);
  const [childrenRecord, setChildrenRecord] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [immunizations, setImmunizations] = useState([]);
  const [checkups, setCheckups] = useState([]);
  const [seniorRecord, setSeniorRecord] = useState(null);

  useEffect(() => {
    loadAllRecords();
  }, []);

  const loadAllRecords = async () => {
    setLoading(true);
    
    try {
      // Get patient session
      const session = localStorage.getItem('nutritrack_patient_session');
      if (!session) {
        navigate('/patient-login');
        return;
      }
      
      const patientSession = JSON.parse(session);
      const patientId = patientSession.patient_id;
      console.log('Loading records for patient ID:', patientId);
      
      // 1. Load patient info
      const patientsRef = collection(db, 'patients');
      const patientQuery = query(patientsRef, where('patient_id', '==', String(patientId)));
      const patientSnapshot = await getDocs(patientQuery);
      
      let patientInfo = null;
      patientSnapshot.forEach((doc) => {
        patientInfo = doc.data();
      });
      setPatientData(patientInfo);
      console.log('Patient loaded:', patientInfo?.first_name);
      
      // 2. Load children record (for weight, height, birth info)
      const childrenRef = collection(db, 'children_records');
      const childrenQuery = query(childrenRef, where('patient_id', '==', String(patientId)));
      const childrenSnapshot = await getDocs(childrenQuery);
      
      let childRecord = null;
      childrenSnapshot.forEach((doc) => {
        childRecord = doc.data();
      });
      setChildrenRecord(childRecord);
      console.log('Children record:', childRecord);
      
      // 3. Load medical history
      const medicalRef = collection(db, 'medical_history');
      const medicalQuery = query(medicalRef, where('patient_id', '==', String(patientId)));
      const medicalSnapshot = await getDocs(medicalQuery);
      const medicalList = [];
      medicalSnapshot.forEach((doc) => {
        medicalList.push(doc.data());
      });
      setMedicalHistory(medicalList);
      console.log('Medical history:', medicalList.length);
      
      // 4. Load immunizations (for child patients)
      const immunizationsRef = collection(db, 'child_immunizations');
      const immunizationsQuery = query(immunizationsRef, where('patient_id', '==', String(patientId)));
      const immunizationsSnapshot = await getDocs(immunizationsQuery);
      const immunizationsList = [];
      immunizationsSnapshot.forEach((doc) => {
        immunizationsList.push(doc.data());
      });
      setImmunizations(immunizationsList);
      console.log('Immunizations:', immunizationsList.length);
      
      // 5. Load pregnancy checkups (if pregnant)
      if (patientInfo?.patient_type === 'Pregnant') {
        const checkupsRef = collection(db, 'pregnancy_checkups');
        const checkupsQuery = query(checkupsRef, where('patient_id', '==', String(patientId)));
        const checkupsSnapshot = await getDocs(checkupsQuery);
        const checkupsList = [];
        checkupsSnapshot.forEach((doc) => {
          checkupsList.push(doc.data());
        });
        setCheckups(checkupsList);
        console.log('Checkups:', checkupsList.length);
      }
      
      // 6. Load senior record (if senior)
      if (patientInfo?.patient_type === 'Senior') {
        const seniorRef = collection(db, 'senior_records');
        const seniorQuery = query(seniorRef, where('patient_id', '==', String(patientId)));
        const seniorSnapshot = await getDocs(seniorQuery);
        let seniorData = null;
        seniorSnapshot.forEach((doc) => {
          seniorData = doc.data();
        });
        setSeniorRecord(seniorData);
        console.log('Senior record:', seniorData);
      }
      
    } catch (error) {
      console.error('Error loading records:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get latest vitals from checkups or children record
  const getLatestVitals = () => {
    let weight = '--';
    let weightDate = null;
    let bloodPressure = '-- / --';
    let bpDate = null;
    let bmi = '--';
    
    // Get weight from children record
    if (childrenRecord?.birth_weight) {
      weight = `${childrenRecord.birth_weight} kg`;
      weightDate = childrenRecord.created_at;
    }
    
    // Get height and calculate BMI from children record
    if (childrenRecord?.birth_height && childrenRecord?.birth_weight) {
      const heightInM = childrenRecord.birth_height / 100;
      const weightNum = childrenRecord.birth_weight;
      if (heightInM > 0 && weightNum > 0) {
        const bmiValue = weightNum / (heightInM * heightInM);
        bmi = bmiValue.toFixed(1);
      }
    }
    
    // Get blood pressure from checkups
    if (checkups.length > 0) {
      const sortedCheckups = [...checkups].sort((a, b) => 
        new Date(b.checkup_date) - new Date(a.checkup_date)
      );
      const latestCheckup = sortedCheckups[0];
      if (latestCheckup.blood_pressure) {
        bloodPressure = latestCheckup.blood_pressure;
        bpDate = latestCheckup.checkup_date;
      }
    }
    
    return { weight, weightDate, bloodPressure, bpDate, bmi };
  };

  // Get last consultation date
  const getLastConsultation = () => {
    const allConsultations = [
      ...medicalHistory.map(m => ({ date: m.diagnosis_date, type: 'medical' })),
      ...checkups.map(c => ({ date: c.checkup_date, type: 'checkup' }))
    ].filter(item => item.date);
    
    if (allConsultations.length === 0) return null;
    
    const latest = allConsultations.sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    )[0];
    
    return latest.date;
  };

  // Get next review date (from latest checkup)
  const getNextReview = () => {
    if (checkups.length > 0) {
      const sortedCheckups = [...checkups].sort((a, b) => 
        new Date(b.checkup_date) - new Date(a.checkup_date)
      );
      const latestCheckup = sortedCheckups[0];
      if (latestCheckup.next_checkup_date) {
        return latestCheckup.next_checkup_date;
      }
    }
    return null;
  };

  const vitals = getLatestVitals();
  const lastConsultation = getLastConsultation();
  const nextReview = getNextReview();

  const formatDate = (dateString) => {
    if (!dateString) return 'Not recorded';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getInitials = () => {
    if (!patientData) return 'PT';
    const first = patientData.first_name?.charAt(0) || '';
    const last = patientData.last_name?.charAt(0) || '';
    return (first + last).toUpperCase();
  };

  if (loading) {
    return (
      <div className="mobile-app">
        <div className="mobile-shell" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
            <p>Loading your health records...</p>
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
            <small>Personal health file</small>
            <h2>Health Records</h2>
          </div>
          <div className="avatar-chip">{getInitials()}</div>
        </div>

        <div className="notice-bar info">
          📋 {patientData?.first_name} {patientData?.last_name} • {patientData?.patient_type || 'General'} Patient
        </div>

        {/* Summary Stats */}
        <div className="summary-grid">
          <div className="summary-card">
            <strong>{vitals.bloodPressure}</strong>
            <span>Latest blood pressure</span>
          </div>
          <div className="summary-card">
            <strong>{vitals.bmi !== '--' ? vitals.bmi : 'N/A'}</strong>
            <span>Current BMI</span>
          </div>
          <div className="summary-card">
            <strong>{lastConsultation ? formatDate(lastConsultation) : 'No records'}</strong>
            <span>Last consultation</span>
          </div>
          <div className="summary-card">
            <strong>{nextReview ? formatDate(nextReview) : 'Not scheduled'}</strong>
            <span>Next review</span>
          </div>
        </div>

        {/* Latest Vitals Section */}
        <div className="section-block">
          <div className="section-header">
            <h3>📊 Latest Vitals</h3>
          </div>
          <div className="record-list">
            <div className="record-card">
              <div className="record-item-header">
                <div>
                  <h4>Weight</h4>
                  <p>{vitals.weightDate ? formatDate(vitals.weightDate) : 'Not recorded'}</p>
                </div>
                <span className="inline-pill neutral">{vitals.weight}</span>
              </div>
              <p>From birth/health record</p>
            </div>
            
            <div className="record-card">
              <div className="record-item-header">
                <div>
                  <h4>Blood Pressure</h4>
                  <p>{vitals.bpDate ? formatDate(vitals.bpDate) : 'Not recorded'}</p>
                </div>
                <span className="inline-pill neutral">{vitals.bloodPressure}</span>
              </div>
              <p>Latest checkup measurement</p>
            </div>
            
            <div className="record-card">
              <div className="record-item-header">
                <div>
                  <h4>BMI (Body Mass Index)</h4>
                  <p>Calculated from height & weight</p>
                </div>
                <span className="inline-pill neutral">{vitals.bmi !== '--' ? vitals.bmi : 'N/A'}</span>
              </div>
              <p>Normal range: 18.5 - 24.9</p>
            </div>
            
            <div className="record-card">
              <div className="record-item-header">
                <div>
                  <h4>Blood Type</h4>
                  <p>From patient record</p>
                </div>
                <span className="inline-pill neutral">{patientData?.blood_type || 'Not recorded'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Medical History / Conditions */}
        {medicalHistory.length > 0 && (
          <div className="section-block">
            <div className="section-header">
              <h3>🏥 Medical History</h3>
            </div>
            <div className="record-list">
              {medicalHistory.map((record, idx) => (
                <div className="record-card" key={idx}>
                  <div className="record-item-header">
                    <div>
                      <h4>{record.condition}</h4>
                      <p>Diagnosed: {formatDate(record.diagnosis_date)}</p>
                    </div>
                    <span className={`status-pill ${record.status === 'Ongoing' ? 'pending' : 'completed'}`}>
                      {record.status?.toLowerCase() || 'active'}
                    </span>
                  </div>
                  {record.treatment_notes && <p className="text-muted">{record.treatment_notes}</p>}
                  {record.doctor_name && <p style={{ fontSize: '12px', marginTop: '8px' }}>👨‍⚕️ {record.doctor_name}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Immunizations Section (for children) */}
        {immunizations.length > 0 && (
          <div className="section-block">
            <div className="section-header">
              <h3>💉 Immunizations</h3>
            </div>
            <div className="record-list">
              {immunizations.map((imm, idx) => (
                <div className="record-card" key={idx}>
                  <div className="record-item-header">
                    <div>
                      <h4>{imm.vaccine_name || `Vaccine ${imm.vaccine_id}`}</h4>
                      <p>Dose {imm.dose_number} • {formatDate(imm.date_given)}</p>
                    </div>
                    <span className="status-pill completed">completed</span>
                  </div>
                  {imm.remarks && <p className="text-muted">{imm.remarks}</p>}
                  {imm.doctor_name && <p style={{ fontSize: '12px', marginTop: '8px' }}>👨‍⚕️ {imm.doctor_name}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pregnancy Checkups Section (for pregnant patients) */}
        {checkups.length > 0 && (
          <div className="section-block">
            <div className="section-header">
              <h3>🤰 Pregnancy Checkups</h3>
            </div>
            <div className="record-list">
              {checkups.map((checkup, idx) => (
                <div className="record-card" key={idx}>
                  <div className="record-item-header">
                    <div>
                      <h4>Trimester {checkup.trimester} Checkup</h4>
                      <p>{formatDate(checkup.checkup_date)}</p>
                    </div>
                    <span className={`status-pill ${checkup.status === 'Completed' ? 'completed' : 'pending'}`}>
                      {checkup.status?.toLowerCase() || 'scheduled'}
                    </span>
                  </div>
                  <div className="info-grid" style={{ marginTop: '10px' }}>
                    <div className="info-cell">
                      <small>Gestational Age</small>
                      <strong>{checkup.gestational_age} weeks</strong>
                    </div>
                    <div className="info-cell">
                      <small>Blood Pressure</small>
                      <strong>{checkup.blood_pressure || '--'}</strong>
                    </div>
                    <div className="info-cell">
                      <small>Weight</small>
                      <strong>{checkup.weight ? `${checkup.weight} kg` : '--'}</strong>
                    </div>
                  </div>
                  {checkup.doctor_notes && <p className="text-muted" style={{ marginTop: '10px' }}>📝 {checkup.doctor_notes}</p>}
                  {checkup.doctor_name && <p style={{ fontSize: '12px', marginTop: '8px' }}>👨‍⚕️ {checkup.doctor_name}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Senior Record Section */}
        {seniorRecord && (
          <div className="section-block">
            <div className="section-header">
              <h3>👴 Senior Care</h3>
            </div>
            <div className="record-card">
              <div className="record-item-header">
                <div>
                  <h4>Medication & Care</h4>
                </div>
              </div>
              {seniorRecord.medication_history && (
                <p><strong>Medication History:</strong> {seniorRecord.medication_history}</p>
              )}
              {seniorRecord.vision_status && (
                <p><strong>Vision:</strong> {seniorRecord.vision_status}</p>
              )}
              {seniorRecord.hearing_status && (
                <p><strong>Hearing:</strong> {seniorRecord.hearing_status}</p>
              )}
              {seniorRecord.physical_activity && (
                <p><strong>Physical Activity:</strong> {seniorRecord.physical_activity}</p>
              )}
              {seniorRecord.emergency_contact_name && (
                <p><strong>Emergency Contact:</strong> {seniorRecord.emergency_contact_name} ({seniorRecord.emergency_contact_number})</p>
              )}
              {seniorRecord.remarks && <p className="text-muted">{seniorRecord.remarks}</p>}
            </div>
          </div>
        )}

        {/* Clinical Notes from Medical History */}
        {medicalHistory.filter(m => m.treatment_notes).length > 0 && (
          <div className="section-block">
            <div className="section-header">
              <h3>📝 Clinical Notes</h3>
            </div>
            <div className="record-list">
              {medicalHistory.filter(m => m.treatment_notes).map((record, idx) => (
                <div className="record-card" key={idx}>
                  <div className="record-item-header">
                    <div>
                      <h4>{record.condition}</h4>
                      <p>Updated {formatDate(record.diagnosis_date)}</p>
                    </div>
                  </div>
                  <p className="text-muted">{record.treatment_notes}</p>
                  {record.remarks && <p className="text-muted" style={{ marginTop: '8px' }}>{record.remarks}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {medicalHistory.length === 0 && immunizations.length === 0 && checkups.length === 0 && !childrenRecord && (
          <div className="section-block">
            <div className="list-card">
              <div className="empty-state">
                <p>📋 No health records found</p>
                <p style={{ fontSize: '12px', marginTop: '8px' }}>
                  Your health records will appear here once available from the health center.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}