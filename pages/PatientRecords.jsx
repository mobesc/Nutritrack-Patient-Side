import BottomNav from '../components/BottomNav';
import '../styles/patient-mobile.css';

export default function PatientRecords() {
  return (
    <div className="mobile-app">
      <div className="mobile-shell">
        <div className="mobile-header">
          <div className="greeting-block">
            <small>Personal health file</small>
            <h2>Health Records</h2>
          </div>
          <div className="avatar-chip">AD</div>
        </div>

        <div className="notice-bar info">This mobile view keeps the patient’s consultation summary, vitals, immunization status, medications, and provider notes in one place.</div>

        <div className="summary-grid">
            <div className="summary-card"><strong>118 / 76</strong><span>Latest blood pressure</span></div>
            <div className="summary-card"><strong>22.4</strong><span>Current BMI</span></div>
            <div className="summary-card"><strong>Mar 12, 2026</strong><span>Last consultation</span></div>
            <div className="summary-card"><strong>Mar 22, 2026</strong><span>Next review</span></div>
        </div>

        <div className="section-block" style={{ marginTop: '20px' }}>
          <div className="section-header"><h3>Latest vitals</h3></div>
          <div className="record-list">
             <div className="record-card">
                <div className="record-item-header">
                    <div>
                        <h4>Weight</h4>
                        <p>Mar 12, 2026</p>
                    </div>
                    <span className="inline-pill neutral">58.4 kg</span>
                </div>
                <p>Healthy range maintained.</p>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}