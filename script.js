

// Global variables
let currentUser = null;
let patients = [];
let queue = [];
let reports = [];
let mediaRecorder = null;
let audioChunks = [];
let recordingStartTime = null;
let timerInterval = null;
let currentPatientForConsultation = null;

// Initialize with sample data
function initializeSampleData() {
    // Sample patients
    patients = [
        {
            id: 1,
            name: "John Doe",
            phone: "+919876543210",
            age: 35,
            gender: "male",
            complaint: "Chest pain and shortness of breath",
            history: "Hypertension, family history of heart disease",
            queueNumber: 1,
            status: "completed"
        },
        {
            id: 2,
            name: "Jane Smith",
            phone: "+919876543211",
            age: 28,
            gender: "female",
            complaint: "Recurring headaches and nausea",
            history: "Migraine history, currently on oral contraceptives",
            queueNumber: 2,
            status: "pending"
        }
    ];

    // Sample reports
    reports = [
        {
            id: 1,
            patientPhone: "+919876543210",
            patientName: "John Doe",
            date: "2025-08-19",
            diagnosis: "Cardiac chest pain, possible angina",
            prescription: "Aspirin 81mg daily, Metoprolol 50mg twice daily",
            notes: "Follow up in 2 weeks, stress test recommended",
            status: "ready"
        }
    ];

    updateQueueDisplay();
}

// Navigation functions
function showLoginSelection() {
    hideAllSections();
    document.getElementById('loginSelection').classList.remove('hidden');
}

function showLogin(type) {
    hideAllSections();
    if (type === 'doctor') {
        document.getElementById('doctorLogin').classList.remove('hidden');
    } else {
        document.getElementById('patientLogin').classList.remove('hidden');
    }
}

function hideAllSections() {
    const sections = ['loginSelection', 'doctorLogin', 'patientLogin', 'doctorDashboard', 
                    'patientRegistration', 'consultationPage', 'patientDashboard'];
    sections.forEach(section => {
        document.getElementById(section).classList.add('hidden');
    });
}

// Authentication
function loginDoctor() {
    const email = document.getElementById('doctorEmail').value;
    const password = document.getElementById('doctorPassword').value;

    if (email === 'doctor@clinic.com' && password === 'password') {
        currentUser = { type: 'doctor', email: email };
        showDoctorDashboard();
        showNotification('Login successful!', 'success');
    } else {
        showNotification('Invalid credentials!', 'error');
    }
}

function loginPatient() {
    const phone = document.getElementById('patientPhone').value;
    
    if (phone) {
        currentUser = { type: 'patient', phone: phone };
        showPatientDashboard();
        showNotification('Login successful!', 'success');
    } else {
        showNotification('Please enter your phone number!', 'error');
    }
}

function logout() {
    currentUser = null;
    showLoginSelection();
    showNotification('Logged out successfully!', 'success');
}

// Doctor Dashboard
function showDoctorDashboard() {
    hideAllSections();
    document.getElementById('doctorDashboard').classList.remove('hidden');
    updateQueueDisplay();
}

function showPatientRegistration() {
    hideAllSections();
    document.getElementById('patientRegistration').classList.remove('hidden');
    document.getElementById('assignedQueue').classList.add('hidden');
}

function showConsultationPage() {
    hideAllSections();
    document.getElementById('consultationPage').classList.remove('hidden');
    resetConsultationPage();
}

// Patient Registration
function registerPatient() {
    const name = document.getElementById('patientName').value;
    const phone = document.getElementById('newPatientPhone').value;
    const age = document.getElementById('patientAge').value;
    const gender = document.getElementById('patientGender').value;
    const complaint = document.getElementById('patientComplaint').value;
    const history = document.getElementById('patientHistory').value;

    if (!name || !phone || !age || !gender || !complaint) {
        showNotification('Please fill all required fields!', 'error');
        return;
    }

    const queueNumber = queue.length + 1;
    const newPatient = {
        id: patients.length + 1,
        name: name,
        phone: phone,
        age: parseInt(age),
        gender: gender,
        complaint: complaint,
        history: history,
        queueNumber: queueNumber,
        status: 'pending'
    };

    patients.push(newPatient);
    queue.push(newPatient);

    document.getElementById('queueNumber').textContent = queueNumber;
    document.getElementById('assignedQueue').classList.remove('hidden');

    // Clear form
    document.getElementById('patientName').value = '';
    document.getElementById('newPatientPhone').value = '';
    document.getElementById('patientAge').value = '';
    document.getElementById('patientGender').value = '';
    document.getElementById('patientComplaint').value = '';
    document.getElementById('patientHistory').value = '';

    updateQueueDisplay();
    showNotification(`Patient registered with Queue Number: ${queueNumber}`, 'success');
}

// Queue Management
function updateQueueDisplay() {
    const queueList = document.getElementById('queueList');
    if (!queueList) return;

    queueList.innerHTML = '';
    
    if (queue.length === 0) {
        queueList.innerHTML = '<p style="text-align: center; color: #666;">No patients in queue</p>';
        return;
    }

    queue.forEach(patient => {
        const patientCard = document.createElement('div');
        patientCard.className = 'patient-card';
        patientCard.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h4>Queue #${patient.queueNumber} - ${patient.name}</h4>
                    <p><strong>Phone:</strong> ${patient.phone}</p>
                    <p><strong>Complaint:</strong> ${patient.complaint}</p>
                </div>
                <span class="status-badge status-${patient.status}">${patient.status}</span>
            </div>
        `;
        queueList.appendChild(patientCard);
    });
}

// Consultation Functions
function resetConsultationPage() {
    document.getElementById('consultationQueue').value = '';
    document.getElementById('selectedPatientInfo').classList.add('hidden');
    document.getElementById('recordingSection').classList.add('hidden');
    document.getElementById('reportGeneration').classList.add('hidden');
    currentPatientForConsultation = null;
}

function loadPatientForConsultation() {
    const queueNum = parseInt(document.getElementById('consultationQueue').value);
    const patient = queue.find(p => p.queueNumber === queueNum);

    if (!patient) {
        showNotification('Patient not found in queue!', 'error');
        return;
    }

    currentPatientForConsultation = patient;
    
    // Display patient info
    document.getElementById('selectedPatientName').textContent = patient.name;
    document.getElementById('selectedPatientPhone').textContent = patient.phone;
    document.getElementById('selectedPatientAge').textContent = patient.age;
    document.getElementById('selectedPatientGender').textContent = patient.gender;
    document.getElementById('selectedPatientComplaint').textContent = patient.complaint;

    document.getElementById('selectedPatientInfo').classList.remove('hidden');
    document.getElementById('recordingSection').classList.remove('hidden');
    
    showNotification('Patient loaded successfully!', 'success');
}

// Audio Recording Functions
async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            // In a real application, you would upload this to your server
            console.log('Recording saved:', audioBlob);
            
            document.getElementById('recordingStatus').classList.remove('hidden');
            document.getElementById('playRecording').classList.remove('hidden');
        };

        mediaRecorder.start();
        recordingStartTime = Date.now();
        
        document.getElementById('startRecording').classList.add('hidden');
        document.getElementById('stopRecording').classList.remove('hidden');
        
        startTimer();
        showNotification('Recording started!', 'success');
        
    } catch (error) {
        showNotification('Error accessing microphone!', 'error');
        console.error('Error:', error);
    }
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
        
        document.getElementById('startRecording').classList.remove('hidden');
        document.getElementById('stopRecording').classList.add('hidden');
        
        stopTimer();
        showNotification('Recording stopped!', 'success');
    }
}

function playRecording() {
    if (audioChunks.length > 0) {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        const elapsed = Date.now() - recordingStartTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        document.getElementById('recordingTimer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function processRecording() {
    document.getElementById('reportGeneration').classList.remove('hidden');
    
    // Simulate API processing
    setTimeout(() => {
        generateReport();
    }, 3000);
}

function generateReport() {
    if (!currentPatientForConsultation) return;

    // Simulate report generation
    const report = {
        id: reports.length + 1,
        patientPhone: currentPatientForConsultation.phone,
        patientName: currentPatientForConsultation.name,
        date: new Date().toISOString().split('T')[0],
        diagnosis: "Preliminary diagnosis based on consultation",
        prescription: "Medication and treatment plan",
        notes: "Follow-up recommendations and additional notes",
        status: "ready"
    };

    reports.push(report);
    
    // Update patient status
    currentPatientForConsultation.status = 'completed';
    updateQueueDisplay();

    document.getElementById('reportGeneration').innerHTML = `
        <h3>Report Generated Successfully!</h3>
        <p>The medical report has been generated and is now available to the patient.</p>
        <button class="btn" onclick="showDoctorDashboard()">Return to Dashboard</button>
    `;

    showNotification('Report generated successfully!', 'success');
}

// Patient Dashboard
function showPatientDashboard() {
    hideAllSections();
    document.getElementById('patientDashboard').classList.remove('hidden');
    loadPatientReports();
}

function loadPatientReports() {
    const phone = currentUser.phone;
    const patientReports = reports.filter(report => report.patientPhone === phone);
    const patient = patients.find(p => p.phone === phone);

    const patientInfo = document.getElementById('patientInfo');
    if (patient) {
        patientInfo.innerHTML = `
            <div class="patient-card">
                <h3>Welcome, ${patient.name}</h3>
                <p><strong>Phone:</strong> ${patient.phone}</p>
                <p><strong>Age:</strong> ${patient.age} | <strong>Gender:</strong> ${patient.gender}</p>
                ${patient.queueNumber ? `<p><strong>Queue Number:</strong> ${patient.queueNumber} 
                <span class="status-badge status-${patient.status}">${patient.status}</span></p>` : ''}
            </div>
        `;
    }

    const reportsContainer = document.getElementById('patientReports');
    if (patientReports.length === 0) {
        reportsContainer.innerHTML = '<p style="text-align: center; color: #666;">No reports available</p>';
        return;
    }

    reportsContainer.innerHTML = '';
    patientReports.forEach(report => {
        const reportCard = document.createElement('div');
        reportCard.className = 'patient-card';
        reportCard.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div style="flex: 1;">
                    <h4>Medical Report - ${report.date}</h4>
                    <p><strong>Diagnosis:</strong> ${report.diagnosis}</p>
                    <p><strong>Prescription:</strong> ${report.prescription}</p>
                    <p><strong>Notes:</strong> ${report.notes}</p>
                </div>
                <div>
                    <span class="status-badge status-${report.status}">${report.status}</span>
                    <br><br>
                    <button class="btn" onclick="downloadReport(${report.id})">📄 Download PDF</button>
                </div>
            </div>
        `;
        reportsContainer.appendChild(reportCard);
    });
}

function downloadReport(reportId) {
    // Simulate PDF download
    const report = reports.find(r => r.id === reportId);
    if (report) {
        // In a real application, this would trigger actual PDF download
        const pdfContent = `
MEDICAL REPORT
==============

Patient: ${report.patientName}
Date: ${report.date}
Phone: ${report.patientPhone}

DIAGNOSIS:
${report.diagnosis}

PRESCRIPTION:
${report.prescription}

NOTES:
${report.notes}

Doctor's Signature: _______________
        `;
        
        const blob = new Blob([pdfContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `medical_report_${report.patientName}_${report.date}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('Report downloaded successfully!', 'success');
    }
}

// Notification system
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Search functionality for doctor
function searchPatient(searchTerm) {
    const results = patients.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm) ||
        patient.queueNumber.toString().includes(searchTerm)
    );
    return results;
}

// API Integration placeholder functions
async function sendAudioToAPI(audioBlob) {
    // This would be your actual API endpoint for audio transcription
    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('patientId', currentPatientForConsultation.id);
    
    try {
        const response = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            const result = await response.json();
            return result.transcription;
        } else {
            throw new Error('Transcription failed');
        }
    } catch (error) {
        console.error('Error sending audio to API:', error);
        showNotification('Error processing audio', 'error');
        return null;
    }
}

async function generateMedicalReport(transcription, patientData) {
    // This would be your actual API endpoint for report generation
    const reportData = {
        transcription: transcription,
        patient: patientData,
        timestamp: new Date().toISOString()
    };
    
    try {
        const response = await fetch('/api/generate-report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reportData)
        });
        
        if (response.ok) {
            const result = await response.json();
            return result.report;
        } else {
            throw new Error('Report generation failed');
        }
    } catch (error) {
        console.error('Error generating report:', error);
        showNotification('Error generating report', 'error');
        return null;
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeSampleData();
    showLoginSelection();
});

// Additional utility functions
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(date) {
    return new Date(date).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Export functions for potential external use
window.medicalPortal = {
    searchPatient,
    downloadReport,
    sendAudioToAPI,
    generateMedicalReport
};

