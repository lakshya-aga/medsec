import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

// Auth components
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';

// Doctor components
import { DoctorDashboardComponent } from './components/doctor/dashboard/dashboard.component';
import { PatientFormComponent } from './components/doctor/patient-form/patient-form.component';
import { SessionRecorderComponent } from './components/doctor/session-recorder/session-recorder.component';

// Patient components
import { PatientDashboardComponent } from './components/patient/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  // Doctor routes
  {
    path: 'doctor/dashboard',
    component: DoctorDashboardComponent,
    canActivate: [AuthGuard],
    data: { role: 'doctor' }
  },
  {
    path: 'doctor/patient-form',
    component: PatientFormComponent,
    canActivate: [AuthGuard],
    data: { role: 'doctor' }
  },
  {
    path: 'doctor/session-recorder',
    component: SessionRecorderComponent,
    canActivate: [AuthGuard],
    data: { role: 'doctor' }
  },
  
  // Patient routes
  {
    path: 'patient/dashboard',
    component: PatientDashboardComponent,
    canActivate: [AuthGuard],
    data: { role: 'patient' }
  },
  
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
