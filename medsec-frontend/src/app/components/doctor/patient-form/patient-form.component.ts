import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.css']
})
export class PatientFormComponent {
  patientForm: FormGroup;
  loading = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.patientForm = this.fb.group({
      full_name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-()]+$/)]],
      email: ['', [Validators.email]],
      age: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
      gender: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.patientForm.valid) {
      this.loading = true;
      this.error = '';
      this.success = '';
      
      this.apiService.createPatient(this.patientForm.value).subscribe({
        next: (patient) => {
          this.loading = false;
          this.success = `Patient created successfully! Queue Number: ${patient.queue_number}`;
          this.patientForm.reset();
          
          setTimeout(() => {
            this.router.navigate(['/doctor/dashboard']);
          }, 2000);
        },
        error: (error) => {
          this.loading = false;
          this.error = error.error?.detail || 'Failed to create patient';
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/doctor/dashboard']);
  }
}