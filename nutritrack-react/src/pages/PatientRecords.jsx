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
                    <div><h4>Weight</h4><p>Mar 12, 2026</p></div>
                    <span className="inline-pill neutral">58.4 kg</span>
                </div>
                <p>Healthy range maintained.</p>
            </div>
            <div className="record-card">
                <div className="record-item-header">
                    <div><h4>Blood Pressure</h4><p>Mar 12, 2026</p></div>
                    <span className="inline-pill neutral">118 / 76</span>
                </div>
                <p>Stable and within target range.</p>
            </div>
            <div className="record-card">
                <div className="record-item-header">
                    <div><h4>Hemoglobin</h4><p>Mar 12, 2026</p></div>
                    <span className="inline-pill neutral">12.1 g/dL</span>
                </div>
                <p>No anemia concerns raised.</p>
            </div>
          </div>
        </div>

        <div className="section-block">
          <div className="section-header"><h3>Immunizations</h3></div>
          <div className="record-list">
             <div className="record-card">
                <div className="record-item-header">
                    <div><h4>Tdap Booster</h4><p>Nov 18, 2025</p></div>
                    <span className="status-pill completed">completed</span>
                </div>
            </div>
            <div className="record-card">
                <div className="record-item-header">
                    <div><h4>Flu Vaccine</h4><p>Oct 04, 2025</p></div>
                    <span className="status-pill completed">completed</span>
                </div>
            </div>
            <div className="record-card">
                <div className="record-item-header">
                    <div><h4>COVID-19 Booster</h4><p>Apr 05, 2026</p></div>
                    <span className="status-pill pending">scheduled</span>
                </div>
            </div>
          </div>
        </div>

        <div className="section-block">
          <div className="section-header"><h3>Medication reminders</h3></div>
          <div className="record-list">
             <div className="record-card">
                <div className="record-item-header">
                    <div><h4>Ferrous Sulfate</h4><p>1 tablet daily</p></div>
                    <span className="inline-pill neutral">Iron support</span>
                </div>
            </div>
            <div className="record-card">
                <div className="record-item-header">
                    <div><h4>Folic Acid</h4><p>1 tablet daily</p></div>
                    <span className="inline-pill neutral">Prenatal supplement</span>
                </div>
            </div>
          </div>
        </div>

        <div className="section-block">
          <div className="section-header"><h3>Clinical notes</h3></div>
          <div className="record-list">
             <div className="record-card">
                <div className="record-item-header">
                    <div><h4>March consultation summary</h4><p>Updated Mar 12, 2026</p></div>
                </div>
                <p>Continue prenatal vitamins, hydrate well, and monitor fetal movement daily. Return earlier if there is dizziness or unusual swelling.</p>
            </div>
            <div className="record-card">
                <div className="record-item-header">
                    <div><h4>Nutrition guidance</h4><p>Updated Mar 12, 2026</p></div>
                </div>
                <p>Increase protein-rich meals and include leafy vegetables in at least two meals per day.</p>
            </div>
          </div>
        </div>

      </div>
      <BottomNav />
    </div>
  );
}