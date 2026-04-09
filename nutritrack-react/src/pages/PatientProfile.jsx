// src/pages/PatientProfile.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { db } from '../firebase/config';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import '../styles/patient-mobile.css';

export default function PatientProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [patientData, setPatientData] = useState(null);
  const [patientDocId, setPatientDocId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    mobileNumber: '',
    birthdate: '',
    bloodType: '',
    address: '',
    emergencyContact: '',
    philhealthNo: '',
    allergies: ''
  });

  useEffect(() => {
    loadPatientProfile();
  }, []);

  const loadPatientProfile = async () => {
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
      console.log('Loading profile for patient ID:', patientId);
      
      // Fetch patient data
      const patientsRef = collection(db, 'patients');
      const q = query(patientsRef, where('patient_id', '==', String(patientId)));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.log('Patient not found');
        setLoading(false);
        return;
      }
      
      let patientInfo = null;
      let docId = null;
      querySnapshot.forEach((doc) => {
        patientInfo = doc.data();
        docId = doc.id;
      });
      
      setPatientData(patientInfo);
      setPatientDocId(docId);
      
      // Populate form with existing data
      setFormData({
        firstName: patientInfo.first_name || '',
        lastName: patientInfo.last_name || '',
        middleName: patientInfo.middle_name || '',
        email: patientInfo.email || '',
        mobileNumber: patientInfo.mobile_number || '',
        birthdate: patientInfo.birthdate || '',
        bloodType: patientInfo.blood_type || '',
        address: patientInfo.address || '',
        emergencyContact: patientInfo.emergency_contact || '',
        philhealthNo: patientInfo.philhealth_no || '',
        allergies: patientInfo.allergy || ''
      });
      
      console.log('Profile loaded');
      
    } catch (error) {
      console.error('Error loading profile:', error);
      alert('Error loading profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (!patientDocId) {
        alert('Patient record not found');
        return;
      }
      
      // Update patient document
      const patientRef = doc(db, 'patients', patientDocId);
      await updateDoc(patientRef, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        middle_name: formData.middleName,
        email: formData.email,
        mobile_number: formData.mobileNumber,
        birthdate: formData.birthdate,
        blood_type: formData.bloodType,
        address: formData.address,
        emergency_contact: formData.emergencyContact,
        philhealth_no: formData.philhealthNo,
        allergy: formData.allergies,
        updated_at: new Date().toISOString()
      });
      
      // Update session with new name
      const session = localStorage.getItem('nutritrack_patient_session');
      if (session) {
        const patientSession = JSON.parse(session);
        patientSession.name = `${formData.firstName} ${formData.lastName}`;
        localStorage.setItem('nutritrack_patient_session', JSON.stringify(patientSession));
      }
      
      alert('Profile updated successfully!');
      
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('nutritrack_patient_session');
    navigate('/patient-login');
  };

  const getInitials = () => {
    if (!formData.firstName && !formData.lastName) return 'PT';
    const first = formData.firstName?.charAt(0) || '';
    const last = formData.lastName?.charAt(0) || '';
    return (first + last).toUpperCase();
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    return dateString;
  };

  if (loading) {
    return (
      <div className="mobile-app">
        <div className="mobile-shell" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
            <p>Loading your profile...</p>
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
            <small>Account settings</small>
            <h2>My Profile</h2>
          </div>
          <div className="avatar-chip">{getInitials()}</div>
        </div>

        <div className="profile-card">
          <div className="profile-meta">
            <div className="avatar-chip" style={{ width: '56px', height: '56px' }}>{getInitials()}</div>
            <div className="profile-meta-text">
              <h3>{formData.firstName} {formData.lastName}</h3>
              <p>Patient ID: {patientData?.patient_id || 'Loading...'}</p>
              <p style={{ fontSize: '12px', color: '#2B6896' }}>{patientData?.patient_type || 'General'} Patient</p>
            </div>
          </div>

          <div className="notice-bar info">
            📝 Update your personal information below. Changes will be saved to your health record.
          </div>

          <form className="form-stack" onSubmit={handleSaveProfile}>
            <div className="field-row">
              <div className="input-group">
                <label>First Name *</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="input-group">
                <label>Last Name *</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            <div className="input-group">
              <label>Middle Name</label>
              <input 
                type="text" 
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                placeholder="Optional"
              />
            </div>
            
            <div className="field-row">
              <div className="input-group">
                <label>Email *</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="input-group">
                <label>Mobile Number *</label>
                <input 
                  type="text" 
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="09123456789"
                  required 
                />
              </div>
            </div>

            <div className="field-row">
              <div className="input-group">
                <label>Birthday</label>
                <input 
                  type="date" 
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <label>Blood Type</label>
                <select name="bloodType" value={formData.bloodType} onChange={handleChange}>
                  <option value="">Select Blood Type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>Address</label>
              <textarea 
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Complete address"
                rows="2"
              ></textarea>
            </div>

            <div className="field-row">
              <div className="input-group">
                <label>Emergency Contact</label>
                <input 
                  type="text" 
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  placeholder="Name and number"
                />
              </div>
              <div className="input-group">
                <label>PhilHealth No.</label>
                <input 
                  type="text" 
                  name="philhealthNo"
                  value={formData.philhealthNo}
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </div>
            </div>

            <div className="input-group">
              <label>Allergies / Medical Conditions</label>
              <textarea 
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                placeholder="List any allergies or medical conditions"
                rows="2"
              ></textarea>
            </div>
            
            <div className="inline-actions">
              <button type="submit" className="primary-btn" disabled={saving}>
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
              <button type="button" onClick={handleLogout} className="secondary-btn">Logout</button>
            </div>
          </form>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}