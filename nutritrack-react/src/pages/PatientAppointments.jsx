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

        <div className="summary-grid">
          <div className="summary-card"><strong>3</strong><span>Total bookings</span></div>
          <div className="summary-card"><strong>1</strong><span>Confirmed</span></div>
          <div className="summary-card"><strong>1</strong><span>Pending review</span></div>
          <div className="summary-card"><strong>1</strong><span>Completed visits</span></div>
        </div>

        <div className="section-block">
          <div className="section-header">
            <h3>Upcoming status</h3>
          </div>
          <div className="list-card">
            <div className="appointment-list">
              <div className="appointment-item">
                <div className="appointment-item-header">
                  <div>
                    <h4>Prenatal Checkup</h4>
                    <p>Mar 22, 2026 • 09:00 AM</p>
                  </div>
                  <span className="status-pill confirmed">confirmed</span>
                </div>
                <p>Dr. Reyes • Barangay Health Center - Room 2</p>
                <p className="text-muted">Bring your maternal health booklet and latest ultrasound result.</p>
              </div>
              <div className="appointment-item">
                <div className="appointment-item-header">
                  <div>
                    <h4>Child Immunization</h4>
                    <p>Mar 27, 2026 • 10:30 AM</p>
                  </div>
                  <span className="status-pill pending">pending</span>
                </div>
                <p>Nurse Santos • Barangay Health Center - Immunization Area</p>
                <p className="text-muted">Status awaiting final confirmation from the health center.</p>
              </div>
            </div>
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
                    <option>Nutrition Consultation</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Preferred Provider</label>
                  <select required>
                    <option value="">Select provider</option>
                    <option>Dr. Reyes</option>
                    <option>Nurse Santos</option>
                    <option>Nutritionist Cruz</option>
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

        <div className="section-block">
          <div className="section-header">
            <h3>Appointment history</h3>
          </div>
          <div className="list-card">
            <div className="timeline-list">
              <div className="timeline-item">
                <div className="appointment-item-header">
                  <div>
                    <h4>Nutrition Consultation</h4>
                    <p>Mar 12, 2026 • 02:00 PM</p>
                  </div>
                  <span className="status-pill completed">completed</span>
                </div>
                <p>Reviewed meal plan and iron supplement intake.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}