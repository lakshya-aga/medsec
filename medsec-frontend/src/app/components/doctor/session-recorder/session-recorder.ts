import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { Patient } from '../../../models/patient.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-session-recorder',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './session-recorder.component.html',
  styleUrls: ['./session-recorder.css']
})
export class SessionRecorderComponent implements OnInit {
  sessionForm: FormGroup;
  patient: Patient | null = null;
  loading = false;
  error = '';
  success = '';
  selectedFile: File | null = null;
  recording = false;
  mediaRecorder: MediaRecorder | null = null;
  audioChunks: Blob[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.sessionForm = this.fb.group({
      queue_number: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    // Check if queue number provided in query params
    const queueNumber = this.route.snapshot.queryParamMap.get('queue');
    if (queueNumber) {
      this.sessionForm.patchValue({ queue_number: queueNumber });
      this.loadPatient();
    }
  }

  loadPatient(): void {
    const queueNumber = this.sessionForm.get('queue_number')?.value;
    if (queueNumber) {
      this.loading = true;
      this.apiService.getPatientByQueue(queueNumber).subscribe({
        next: (patient) => {
          this.patient = patient;
          this.loading = false;
          this.error = '';
        },
        error: (error) => {
          this.loading = false;
          this.error = error.error?.detail || 'Patient not found';
          this.patient = null;
        }
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      this.selectedFile = file;
    } else {
      this.error = 'Please select a valid audio file';
    }
  }

  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        this.selectedFile = new File([audioBlob], 'recorded_audio.wav', { type: 'audio/wav' });
      };

      this.mediaRecorder.start();
      this.recording = true;
    } catch (error) {
      this.error = 'Could not access microphone. Please check permissions.';
    }
  }

  stopRecording(): void {
    if (this.mediaRecorder && this.recording) {
      this.mediaRecorder.stop();
      this.recording = false;
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  }

  onSubmit(): void {
    if (!this.patient) {
      this.error = 'Please load patient information first';
      return;
    }

    if (!this.selectedFile) {
      this.error = 'Please select or record an audio file';
      return;
    }

    this.loading = true;
    this.error = '';
    
    this.apiService.createSession(this.patient.queue_number, this.selectedFile).subscribe({
      next: (response) => {
        this.loading = false;
        this.success = 'Session created successfully!';
        
        setTimeout(() => {
          this.router.navigate(['/doctor/dashboard']);
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.detail || 'Failed to create session';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/doctor/dashboard']);
  }
}