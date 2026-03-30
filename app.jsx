import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PatientLogin from './pages/PatientLogin';
import PatientSignup from './pages/PatientSignup';
import PatientHome from './pages/PatientHome';
import PatientAppointments from './pages/PatientAppointments';
import PatientRecords from './pages/PatientRecords';
import PatientProfile from './pages/PatientProfile';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PatientLogin />} />
        <Route path="/patient-login" element={<PatientLogin />} />
        <Route path="/patient-signup" element={<PatientSignup />} />
        <Route path="/patient-home" element={<PatientHome />} />
        <Route path="/patient-appointments" element={<PatientAppointments />} />
        <Route path="/patient-records" element={<PatientRecords />} />
        <Route path="/patient-profile" element={<PatientProfile />} />
        
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}