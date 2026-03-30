import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PatientLogin from './nutritrack-react/src/pages/PatientLogin';
import PatientSignup from './nutritrack-react/src/pages/PatientSignup';
import PatientHome from './nutritrack-react/src/pages/PatientHome';
import PatientAppointments from './nutritrack-react/src/pages/PatientAppointments';
import PatientRecords from './nutritrack-react/src/pages/PatientRecords';
import PatientProfile from './nutritrack-react/src/pages/PatientProfile';
import AdminLogin from './nutritrack-react/src/pages/AdminLogin';
import Dashboard from './nutritrack-react/src/pages/Dashboard';

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