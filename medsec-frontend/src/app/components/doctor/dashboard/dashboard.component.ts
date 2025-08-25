import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';
import { Patient } from '../../../models/patient.model';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-doctor-dashboard',
  imports: [CommonModule, RouterModule, ReactiveFormsModule], 
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.css']
})
export class DoctorDashboardComponent implements OnInit {
  patients: Patient[] = [];
  loading = true;

  constructor(
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.apiService.getPatients().subscribe({
      next: (patients) => {
        this.patients = patients;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading patients:', error);
        this.loading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
