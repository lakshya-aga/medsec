import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Auth components
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';

// Doctor components
import { DoctorDashboardComponent } from './components/doctor/dashboard/dashboard.component';
import { PatientFormComponent } from './components/doctor/patient-form/patient-form.component';
import { SessionRecorderComponent } from './components/doctor/session-recorder/session-recorder.component';

// Patient components
import { PatientDashboardComponent } from './components/patient/dashboard/dashboard.component';

@NgModule({
  declarations: [
],
imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DoctorDashboardComponent,
    PatientFormComponent,
    SessionRecorderComponent,
    PatientDashboardComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
