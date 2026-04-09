// src/pages/PatientSignup.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, doc, setDoc, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import '../styles/patient-mobile.css';

export default function PatientSignup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    suffix: '',
    birthdate: '',
    age: '',
    gender: '',
    religion: '',
    occupation: '',
    address: '',
    mobileNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    bloodType: '',
    allergy: '',
    patientType: 'General'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMessage('');
    
    if (name === 'birthdate' && value) {
      const age = calculateAge(value);
      setFormData(prev => ({ ...prev, age: age.toString() }));
    }
  };

  const calculateAge = (birthdate) => {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getNextPatientId = async () => {
    try {
      const patientsRef = collection(db, 'patients');
      const q = query(patientsRef, orderBy('patient_id', 'desc'), limit(1));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return '1001';
      }
      
      let lastId = '1001';
      querySnapshot.forEach((doc) => {
        // Get the patient_id from the document data, not the document ID
        lastId = doc.data().patient_id;
      });
      
      const nextNum = parseInt(lastId) + 1;
      return nextNum.toString();
      
    } catch (error) {
      console.error('Error getting next patient ID:', error);
      return '1001';
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.birthdate || !formData.gender || !formData.address || !formData.mobileNumber || !formData.email || !formData.password) {
      setErrorMessage('Please fill in all required fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const patientsRef = collection(db, 'patients');
      
      // Check if email already exists
      const emailQuery = query(patientsRef, where('email', '==', formData.email));
      const emailSnapshot = await getDocs(emailQuery);
      
      if (!emailSnapshot.empty) {
        setErrorMessage('Email already registered. Please login instead.');
        setIsLoading(false);
        return;
      }
      
      // Get next sequential patient ID (1001, 1002, 1003, etc.)
      const nextPatientId = await getNextPatientId();
      
      // Create patient object
      const newPatient = {
        patient_id: nextPatientId,  // This matches the document ID
        first_name: formData.firstName,
        last_name: formData.lastName,
        middle_name: formData.middleName || '',
        suffix: formData.suffix || '',
        birthdate: formData.birthdate,
        age: parseInt(formData.age) || calculateAge(formData.birthdate),
        gender: formData.gender,
        religion: formData.religion || '',
        occupation: formData.occupation || '',
        address: formData.address,
        mobile_number: formData.mobileNumber,
        email: formData.email,
        password: formData.password, // In production, hash this!
        blood_type: formData.bloodType || '',
        allergy: formData.allergy || '',
        patient_type: formData.patientType,
        primary_doctor_id: '',
        created_at: new Date().toISOString(),
        created_via: 'mobile_signup'
      };
      
      // CRITICAL: Use setDoc with the patient_id as the document ID
      // This ensures document ID = patient_id (e.g., "1010")
      await setDoc(doc(db, 'patients', nextPatientId), newPatient);
      
      console.log('Patient created with ID:', nextPatientId);
      console.log('Document ID matches patient_id:', nextPatientId);
      
      // Store patient session
      const patientSession = {
        patient_id: nextPatientId,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        isLoggedIn: true
      };
      localStorage.setItem('nutritrack_patient_session', JSON.stringify(patientSession));
      
      alert(`Account created successfully! Your Patient ID is: ${nextPatientId}`);
      navigate('/patient-home');
      
    } catch (error) {
      console.error('Signup error:', error);
      setErrorMessage('Error creating account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mobile-auth">
      <div className="auth-shell">
        <div className="brand-block">
          <h1>Patient Registration</h1>
          <p>Create your patient account to access health records, book appointments, and more.</p>
        </div>

        <div className="auth-card" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          <div className="auth-header">
            <h2>Sign Up</h2>
            <p>Please fill in all required information (*)</p>
          </div>

          {errorMessage && <div className="notice-bar warning">{errorMessage}</div>}

          <form className="form-stack" onSubmit={handleSignup}>
            <div className="field-row">
              <div className="input-group">
                <label>First Name *</label>
                <input type="text" name="firstName" placeholder="Enter first name" value={formData.firstName} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Last Name *</label>
                <input type="text" name="lastName" placeholder="Enter last name" value={formData.lastName} onChange={handleChange} required />
              </div>
            </div>

            <div className="field-row">
              <div className="input-group">
                <label>Middle Name</label>
                <input type="text" name="middleName" placeholder="Enter middle name" value={formData.middleName} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Suffix</label>
                <input type="text" name="suffix" placeholder="Jr., Sr., III" value={formData.suffix} onChange={handleChange} />
              </div>
            </div>

            <div className="field-row">
              <div className="input-group">
                <label>Birthdate *</label>
                <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Age</label>
                <input type="text" name="age" value={formData.age} readOnly style={{ backgroundColor: '#f0f0f0' }} />
              </div>
            </div>

            <div className="field-row">
              <div className="input-group">
                <label>Gender *</label>
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="input-group">
                <label>Blood Type</label>
                <select name="bloodType" value={formData.bloodType} onChange={handleChange}>
                  <option value="">Select Blood Type</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="AB">AB</option>
                  <option value="O">O</option>
                </select>
              </div>
            </div>

            <div className="field-row">
              <div className="input-group">
                <label>Religion</label>
                <input type="text" name="religion" placeholder="Enter religion" value={formData.religion} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Occupation</label>
                <input type="text" name="occupation" placeholder="Enter occupation" value={formData.occupation} onChange={handleChange} />
              </div>
            </div>

            <div className="input-group">
              <label>Address *</label>
              <textarea name="address" placeholder="Complete address (Barangay, City/Municipality, Province)" value={formData.address} onChange={handleChange} required></textarea>
            </div>

            <div className="field-row">
              <div className="input-group">
                <label>Mobile Number *</label>
                <input type="text" name="mobileNumber" placeholder="09123456789" value={formData.mobileNumber} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Email *</label>
                <input type="email" name="email" placeholder="youremail@example.com" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="input-group">
              <label>Allergy / Medical Conditions</label>
              <textarea name="allergy" placeholder="e.g., Peanuts, Penicillin, Asthma" value={formData.allergy} onChange={handleChange}></textarea>
            </div>

            <div className="field-row">
              <div className="input-group">
                <label>Patient Type</label>
                <select name="patientType" value={formData.patientType} onChange={handleChange}>
                  <option value="General">General</option>
                  <option value="Child">Child</option>
                  <option value="Pregnant">Pregnant</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>
            </div>

            <div className="field-row">
              <div className="input-group">
                <label>Create Password *</label>
                <input type="password" name="password" placeholder="Min. 6 characters" value={formData.password} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Confirm Password *</label>
                <input type="password" name="confirmPassword" placeholder="Confirm password" value={formData.confirmPassword} onChange={handleChange} required />
              </div>
            </div>

            <button type="submit" className="primary-btn" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Register as Patient'}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link className="text-link-btn" to="/patient-login">Login here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}