import BottomNav from '../components/BottomNav';
import '../styles/patient-mobile.css';

export default function PatientAppointments() {
  return (
    <div className="mobile-app">
      <div className="mobile-shell">
        <div className="mobile-header">
          <div className="greeting-block">
            <small>Appointment center</small>
            <h2>Booking & Status</h2>
          </div>
          <div className="avatar-chip">AD</div>
        </div>

        <div className="notice-bar info">Patients can request a schedule, then monitor whether the booking is pending, confirmed, or completed.</div>

        <div className="section-block">
          <div className="section-header">
            <h3>Upcoming status</h3>
          </div>
          <div className="list-card">
            <div className="empty-state">No upcoming appointment yet. Book one below.</div>
          </div>
        </div>

        <div className="section-block">
          <div className="section-header">
            <h3>Book an appointment</h3>
          </div>
          <div className="form-card">
            <div className="notice-bar info">Choose a service, date, and preferred time. New requests are marked as pending.</div>
            <form className="form-stack" onSubmit={(e) => { e.preventDefault(); alert("Request submitted!"); }}>
              <div className="field-row">
                <div className="input-group">
                  <label>Service</label>
                  <select required>
                    <option value="">Select service</option>
                    <option>Prenatal Checkup</option>
                    <option>General Consultation</option>
                    <option>Child Immunization</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Preferred Provider</label>
                  <select required>
                    <option value="">Select provider</option>
                    <option>Dr. Reyes</option>
                    <option>Nurse Santos</option>
                  </select>
                </div>
              </div>

              <div className="field-row">
                <div className="input-group">
                  <label>Date</label>
                  <input type="date" required />
                </div>
                <div className="input-group">
                  <label>Time</label>
                  <input type="time" required />
                </div>
              </div>

              <div className="input-group">
                <label>Reason / Notes</label>
                <textarea placeholder="Add symptoms or reminder..."></textarea>
              </div>

              <button type="submit" className="primary-btn">Submit Appointment Request</button>
            </form>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}