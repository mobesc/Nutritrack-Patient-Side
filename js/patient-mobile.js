const PROFILE_KEY = 'nutritrack_patient_profile';
const SESSION_KEY = 'nutritrack_patient_session';
const APPOINTMENTS_KEY = 'nutritrack_patient_appointments';
const RECORDS_KEY = 'nutritrack_patient_records';

const defaultProfile = {
    id: 'PT-2026-001',
    fullName: 'Ana Dela Cruz',
    email: 'ana.delacruz@example.com',
    password: 'patient123',
    phone: '0917 123 4567',
    birthday: '1994-08-15',
    bloodType: 'O+',
    address: 'Purok 3, Barangay San Isidro',
    emergencyContact: 'Jose Dela Cruz - 0918 765 4321',
    allergies: 'Shellfish',
    philhealth: '12-345678901-2',
    memberSince: '2026-03-01',
    avatarInitials: 'AD'
};

const defaultAppointments = [
    {
        id: 'APT-2026-001',
        date: '2026-03-22',
        time: '09:00',
        type: 'Prenatal Checkup',
        provider: 'Dr. Reyes',
        notes: 'Bring your maternal health booklet and latest ultrasound result.',
        status: 'confirmed',
        location: 'Barangay Health Center - Room 2'
    },
    {
        id: 'APT-2026-002',
        date: '2026-03-12',
        time: '14:00',
        type: 'Nutrition Consultation',
        provider: 'Nutritionist Cruz',
        notes: 'Reviewed meal plan and iron supplement intake.',
        status: 'completed',
        location: 'Barangay Health Center - Nutrition Desk'
    },
    {
        id: 'APT-2026-003',
        date: '2026-03-27',
        time: '10:30',
        type: 'Child Immunization',
        provider: 'Nurse Santos',
        notes: 'Status awaiting final confirmation from the health center.',
        status: 'pending',
        location: 'Barangay Health Center - Immunization Area'
    }
];

const defaultRecords = {
    overview: {
        lastVisit: '2026-03-12',
        nextReview: '2026-03-22',
        bmi: '22.4',
        bloodPressure: '118 / 76',
        bloodType: 'O+',
        careProgram: 'Maternal Care Program'
    },
    vitals: [
        { date: '2026-03-12', label: 'Weight', value: '58.4 kg', note: 'Healthy range maintained.' },
        { date: '2026-03-12', label: 'Blood Pressure', value: '118 / 76', note: 'Stable and within target range.' },
        { date: '2026-03-12', label: 'Hemoglobin', value: '12.1 g/dL', note: 'No anemia concerns raised.' }
    ],
    immunizations: [
        { vaccine: 'Tdap Booster', date: '2025-11-18', status: 'completed' },
        { vaccine: 'Flu Vaccine', date: '2025-10-04', status: 'completed' },
        { vaccine: 'COVID-19 Booster', date: '2026-04-05', status: 'scheduled' }
    ],
    medications: [
        { name: 'Ferrous Sulfate', dosage: '1 tablet daily', purpose: 'Iron support' },
        { name: 'Folic Acid', dosage: '1 tablet daily', purpose: 'Prenatal supplement' }
    ],
    notes: [
        {
            title: 'March consultation summary',
            text: 'Continue prenatal vitamins, hydrate well, and monitor fetal movement daily. Return earlier if there is dizziness or unusual swelling.',
            updatedAt: '2026-03-12'
        },
        {
            title: 'Nutrition guidance',
            text: 'Increase protein-rich meals and include leafy vegetables in at least two meals per day.',
            updatedAt: '2026-03-12'
        }
    ]
};

function getJSON(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
        return fallback;
    }
}

function setJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function seedPatientData() {
    if (!localStorage.getItem(PROFILE_KEY)) {
        setJSON(PROFILE_KEY, defaultProfile);
    }

    if (!localStorage.getItem(APPOINTMENTS_KEY)) {
        setJSON(APPOINTMENTS_KEY, defaultAppointments);
    }

    if (!localStorage.getItem(RECORDS_KEY)) {
        setJSON(RECORDS_KEY, defaultRecords);
    }
}

function getProfile() {
    return getJSON(PROFILE_KEY, defaultProfile);
}

function getAppointments() {
    const appointments = getJSON(APPOINTMENTS_KEY, defaultAppointments);
    return appointments.sort((a, b) => {
        const first = new Date(`${a.date}T${a.time}`);
        const second = new Date(`${b.date}T${b.time}`);
        return first - second;
    });
}

function getRecords() {
    return getJSON(RECORDS_KEY, defaultRecords);
}

function setSession(isLoggedIn) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ isLoggedIn, loginAt: new Date().toISOString() }));
}

function isLoggedIn() {
    const session = getJSON(SESSION_KEY, { isLoggedIn: false });
    return Boolean(session && session.isLoggedIn);
}

function formatDate(dateString) {
    if (!dateString) return '--';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(timeString) {
    if (!timeString) return '--';
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(Number(hours), Number(minutes));
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function formatDateTime(dateString, timeString) {
    return `${formatDate(dateString)} • ${formatTime(timeString)}`;
}

function getInitials(name) {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0].toUpperCase())
        .join('');
}

function getUpcomingAppointments() {
    const now = new Date();
    return getAppointments().filter(item => new Date(`${item.date}T${item.time}`) >= now);
}

function getPastAppointments() {
    const now = new Date();
    return getAppointments().filter(item => new Date(`${item.date}T${item.time}`) < now);
}

function getStatusClass(status) {
    const normalized = String(status || '').toLowerCase();
    if (normalized === 'confirmed') return 'confirmed';
    if (normalized === 'pending' || normalized === 'scheduled') return 'pending';
    if (normalized === 'cancelled') return 'cancelled';
    return 'completed';
}

function updateSharedIdentity() {
    const profile = getProfile();
    const initials = getInitials(profile.fullName || defaultProfile.fullName);

    document.querySelectorAll('[data-patient-name]').forEach(element => {
        element.textContent = profile.fullName || defaultProfile.fullName;
    });

    document.querySelectorAll('[data-patient-initials]').forEach(element => {
        element.textContent = initials;
    });

    document.querySelectorAll('[data-patient-id]').forEach(element => {
        element.textContent = profile.id || defaultProfile.id;
    });
}

function requireAuth() {
    const currentPage = document.body.dataset.page || '';
    const authPages = ['patient-login', 'patient-signup'];

    if (!authPages.includes(currentPage) && !isLoggedIn()) {
        window.location.href = 'patient-login.html';
    }
}

function handleLoginForm() {
    const form = document.getElementById('patientLoginForm');
    if (!form) return;

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        const message = document.getElementById('loginMessage');
        const profile = getProfile();

        if (email.toLowerCase() === profile.email.toLowerCase() && password === profile.password) {
            setSession(true);
            if (message) {
                message.textContent = 'Login successful. Redirecting to your home dashboard...';
                message.className = 'notice-bar success';
            }
            setTimeout(() => {
                window.location.href = 'patient-home.html';
            }, 350);
            return;
        }

        if (message) {
            message.textContent = 'The email or password does not match the saved patient profile.';
            message.className = 'notice-bar warning';
        }
    });
}

function handleSignupForm() {
    const form = document.getElementById('patientSignupForm');
    if (!form) return;

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const newProfile = {
            id: `PT-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
            fullName: document.getElementById('signupName').value.trim(),
            email: document.getElementById('signupEmail').value.trim(),
            password: document.getElementById('signupPassword').value.trim(),
            phone: document.getElementById('signupPhone').value.trim(),
            birthday: document.getElementById('signupBirthday').value,
            bloodType: document.getElementById('signupBloodType').value,
            address: document.getElementById('signupAddress').value.trim(),
            emergencyContact: document.getElementById('signupEmergency').value.trim(),
            allergies: document.getElementById('signupAllergies').value.trim() || 'No known allergies',
            philhealth: document.getElementById('signupPhilhealth').value.trim() || 'Not provided',
            memberSince: new Date().toISOString().slice(0, 10)
        };

        newProfile.avatarInitials = getInitials(newProfile.fullName);
        setJSON(PROFILE_KEY, newProfile);
        setSession(true);

        const existingRecords = getRecords();
        existingRecords.overview.bloodType = newProfile.bloodType || existingRecords.overview.bloodType;
        setJSON(RECORDS_KEY, existingRecords);

        const message = document.getElementById('signupMessage');
        if (message) {
            message.textContent = 'Profile created successfully. Your mobile portal is ready.';
            message.className = 'notice-bar success';
        }

        setTimeout(() => {
            window.location.href = 'patient-home.html';
        }, 350);
    });
}

function renderHomePage() {
    const upcoming = getUpcomingAppointments();
    const records = getRecords();
    const hero = document.getElementById('homeHeroMeta');
    const appointmentList = document.getElementById('homeUpcomingList');
    const recordList = document.getElementById('homeRecordPreview');

    if (hero) {
        const nextAppointment = upcoming[0];
        hero.innerHTML = nextAppointment
            ? `
                <span class="meta-pill">📅 ${formatDate(nextAppointment.date)}</span>
                <span class="meta-pill">⏰ ${formatTime(nextAppointment.time)}</span>
                <span class="meta-pill">📍 ${nextAppointment.location}</span>
            `
            : '<span class="meta-pill">No appointment booked yet</span>';
    }

    if (appointmentList) {
        if (!upcoming.length) {
            appointmentList.innerHTML = '<div class="empty-state">You do not have upcoming appointments yet.</div>';
        } else {
            appointmentList.innerHTML = upcoming.slice(0, 2).map(item => `
                <div class="appointment-item">
                    <div class="appointment-item-header">
                        <div>
                            <h4>${item.type}</h4>
                            <p>${formatDateTime(item.date, item.time)}</p>
                        </div>
                        <span class="status-pill ${getStatusClass(item.status)}">${item.status}</span>
                    </div>
                    <p>${item.provider} • ${item.location}</p>
                    <div class="list-tags">
                        <span>Status check available</span>
                        <span>Bring valid ID</span>
                    </div>
                </div>
            `).join('');
        }
    }

    if (recordList) {
        recordList.innerHTML = `
            <div class="record-card">
                <div class="record-item-header">
                    <div>
                        <h4>Latest vitals</h4>
                        <p>Updated ${formatDate(records.overview.lastVisit)}</p>
                    </div>
                    <span class="inline-pill neutral">Health records</span>
                </div>
                <div class="info-grid">
                    <div class="info-cell"><small>Blood Pressure</small><strong>${records.overview.bloodPressure}</strong></div>
                    <div class="info-cell"><small>BMI</small><strong>${records.overview.bmi}</strong></div>
                    <div class="info-cell"><small>Blood Type</small><strong>${records.overview.bloodType}</strong></div>
                    <div class="info-cell"><small>Care Program</small><strong>${records.overview.careProgram}</strong></div>
                </div>
            </div>
        `;
    }

    const stats = {
        homePendingCount: upcoming.filter(item => item.status === 'pending').length,
        homeConfirmedCount: upcoming.filter(item => item.status === 'confirmed').length,
        homeRecordsCount: records.vitals.length + records.immunizations.length,
        homeMedicationCount: records.medications.length
    };

    Object.entries(stats).forEach(([id, value]) => {
        const target = document.getElementById(id);
        if (target) target.textContent = value;
    });
}

function renderAppointmentsPage() {
    const upcomingList = document.getElementById('upcomingAppointments');
    const historyList = document.getElementById('appointmentHistory');
    const statusSummary = document.getElementById('appointmentSummary');
    const upcoming = getUpcomingAppointments();
    const history = getPastAppointments().reverse();

    if (statusSummary) {
        const all = getAppointments();
        statusSummary.innerHTML = `
            <div class="summary-grid">
                <div class="summary-card"><strong>${all.length}</strong><span>Total bookings</span></div>
                <div class="summary-card"><strong>${all.filter(item => item.status === 'confirmed').length}</strong><span>Confirmed</span></div>
                <div class="summary-card"><strong>${all.filter(item => item.status === 'pending').length}</strong><span>Pending review</span></div>
                <div class="summary-card"><strong>${all.filter(item => item.status === 'completed').length}</strong><span>Completed visits</span></div>
            </div>
        `;
    }

    if (upcomingList) {
        upcomingList.innerHTML = upcoming.length
            ? upcoming.map(item => `
                <div class="appointment-item">
                    <div class="appointment-item-header">
                        <div>
                            <h4>${item.type}</h4>
                            <p>${formatDateTime(item.date, item.time)}</p>
                        </div>
                        <span class="status-pill ${getStatusClass(item.status)}">${item.status}</span>
                    </div>
                    <p>${item.provider} • ${item.location}</p>
                    <p class="text-muted">${item.notes}</p>
                </div>
            `).join('')
            : '<div class="empty-state">No upcoming appointment yet. Book one below.</div>';
    }

    if (historyList) {
        historyList.innerHTML = history.length
            ? history.map(item => `
                <div class="timeline-item">
                    <div class="appointment-item-header">
                        <div>
                            <h4>${item.type}</h4>
                            <p>${formatDateTime(item.date, item.time)}</p>
                        </div>
                        <span class="status-pill ${getStatusClass(item.status)}">${item.status}</span>
                    </div>
                    <p>${item.notes}</p>
                </div>
            `).join('')
            : '<div class="empty-state">Previous appointments will appear here after your visit.</div>';
    }

    const form = document.getElementById('appointmentBookingForm');
    if (form && !form.dataset.bound) {
        form.dataset.bound = 'true';
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            const appointments = getAppointments();
            const newAppointment = {
                id: `APT-${Date.now()}`,
                type: document.getElementById('appointmentType').value,
                date: document.getElementById('appointmentDate').value,
                time: document.getElementById('appointmentTime').value,
                provider: document.getElementById('appointmentProvider').value,
                notes: document.getElementById('appointmentNotes').value.trim() || 'Awaiting additional instructions from the health center.',
                status: 'pending',
                location: 'Barangay Health Center - Main Consultation Room'
            };

            appointments.push(newAppointment);
            setJSON(APPOINTMENTS_KEY, appointments);

            const bookingNotice = document.getElementById('bookingNotice');
            if (bookingNotice) {
                bookingNotice.textContent = 'Appointment request submitted. You can monitor the status on this page.';
                bookingNotice.className = 'notice-bar success';
            }

            form.reset();
            renderAppointmentsPage();
        });
    }
}

function renderRecordsPage() {
    const records = getRecords();
    const summary = document.getElementById('recordsSummary');
    const vitalsList = document.getElementById('vitalsList');
    const immunizationList = document.getElementById('immunizationList');
    const medicationsList = document.getElementById('medicationList');
    const notesList = document.getElementById('notesList');

    if (summary) {
        summary.innerHTML = `
            <div class="summary-grid">
                <div class="summary-card"><strong>${records.overview.bloodPressure}</strong><span>Latest blood pressure</span></div>
                <div class="summary-card"><strong>${records.overview.bmi}</strong><span>Current BMI</span></div>
                <div class="summary-card"><strong>${formatDate(records.overview.lastVisit)}</strong><span>Last consultation</span></div>
                <div class="summary-card"><strong>${formatDate(records.overview.nextReview)}</strong><span>Next review</span></div>
            </div>
        `;
    }

    if (vitalsList) {
        vitalsList.innerHTML = records.vitals.map(item => `
            <div class="record-card">
                <div class="record-item-header">
                    <div>
                        <h4>${item.label}</h4>
                        <p>${formatDate(item.date)}</p>
                    </div>
                    <span class="inline-pill neutral">${item.value}</span>
                </div>
                <p>${item.note}</p>
            </div>
        `).join('');
    }

    if (immunizationList) {
        immunizationList.innerHTML = records.immunizations.map(item => `
            <div class="record-card">
                <div class="record-item-header">
                    <div>
                        <h4>${item.vaccine}</h4>
                        <p>${formatDate(item.date)}</p>
                    </div>
                    <span class="status-pill ${getStatusClass(item.status)}">${item.status}</span>
                </div>
            </div>
        `).join('');
    }

    if (medicationsList) {
        medicationsList.innerHTML = records.medications.map(item => `
            <div class="record-card">
                <div class="record-item-header">
                    <div>
                        <h4>${item.name}</h4>
                        <p>${item.dosage}</p>
                    </div>
                    <span class="inline-pill neutral">${item.purpose}</span>
                </div>
            </div>
        `).join('');
    }

    if (notesList) {
        notesList.innerHTML = records.notes.map(item => `
            <div class="record-card">
                <div class="record-item-header">
                    <div>
                        <h4>${item.title}</h4>
                        <p>Updated ${formatDate(item.updatedAt)}</p>
                    </div>
                </div>
                <p>${item.text}</p>
            </div>
        `).join('');
    }
}

function renderProfilePage() {
    const profile = getProfile();

    const fullName = document.getElementById('profileFullName');
    const email = document.getElementById('profileEmail');
    const phone = document.getElementById('profilePhone');
    const birthday = document.getElementById('profileBirthday');
    const address = document.getElementById('profileAddress');
    const emergency = document.getElementById('profileEmergency');
    const allergies = document.getElementById('profileAllergies');
    const philhealth = document.getElementById('profilePhilhealth');
    const bloodType = document.getElementById('profileBloodType');

    if (fullName) fullName.value = profile.fullName || '';
    if (email) email.value = profile.email || '';
    if (phone) phone.value = profile.phone || '';
    if (birthday) birthday.value = profile.birthday || '';
    if (address) address.value = profile.address || '';
    if (emergency) emergency.value = profile.emergencyContact || '';
    if (allergies) allergies.value = profile.allergies || '';
    if (philhealth) philhealth.value = profile.philhealth || '';
    if (bloodType) bloodType.value = profile.bloodType || '';

    const form = document.getElementById('profileForm');
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            const updatedProfile = {
                ...profile,
                fullName: fullName.value.trim(),
                email: email.value.trim(),
                phone: phone.value.trim(),
                birthday: birthday.value,
                address: address.value.trim(),
                emergencyContact: emergency.value.trim(),
                allergies: allergies.value.trim(),
                philhealth: philhealth.value.trim(),
                bloodType: bloodType.value,
                avatarInitials: getInitials(fullName.value.trim() || defaultProfile.fullName)
            };

            setJSON(PROFILE_KEY, updatedProfile);
            const records = getRecords();
            records.overview.bloodType = updatedProfile.bloodType || records.overview.bloodType;
            setJSON(RECORDS_KEY, records);
            updateSharedIdentity();

            const profileNotice = document.getElementById('profileNotice');
            if (profileNotice) {
                profileNotice.textContent = 'Profile updated successfully.';
                profileNotice.className = 'notice-bar success';
            }
        });
    }

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            setSession(false);
            window.location.href = 'patient-login.html';
        });
    }
}

function setActiveNav() {
    const currentPage = document.body.dataset.page;
    document.querySelectorAll('.bottom-nav a[data-page]').forEach(link => {
        if (link.dataset.page === currentPage) {
            link.classList.add('active');
        }
    });
}

function init() {
    seedPatientData();
    requireAuth();
    updateSharedIdentity();
    setActiveNav();
    handleLoginForm();
    handleSignupForm();

    const page = document.body.dataset.page;
    if (page === 'patient-home') renderHomePage();
    if (page === 'patient-appointments') renderAppointmentsPage();
    if (page === 'patient-records') renderRecordsPage();
    if (page === 'patient-profile') renderProfilePage();
}

document.addEventListener('DOMContentLoaded', init);
