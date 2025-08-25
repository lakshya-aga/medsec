import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, UserCreate, UserLogin, Token } from '../models/user.model';
import { Patient, PatientCreate } from '../models/patient.model';
import { Report } from '../models/session.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Auth endpoints
  register(userData: UserCreate): Observable<Token> {
    return this.http.post<Token>(`${this.apiUrl}/auth/register`, userData);
  }

  login(credentials: UserLogin): Observable<Token> {
    return this.http.post<Token>(`${this.apiUrl}/auth/login`, credentials);
  }

  // Doctor endpoints
  createPatient(patientData: PatientCreate): Observable<Patient> {
    return this.http.post<Patient>(`${this.apiUrl}/doctor/patients`, patientData, {
      headers: this.getAuthHeaders()
    });
  }

  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.apiUrl}/doctor/patients`, {
      headers: this.getAuthHeaders()
    });
  }

  getPatientByQueue(queueNumber: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/doctor/patient/${queueNumber}`, {
      headers: this.getAuthHeaders()
    });
  }

  createSession(queueNumber: number, audioFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('audio_file', audioFile);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.post(`${this.apiUrl}/doctor/session/${queueNumber}`, formData, {
      headers: headers
    });
  }

  // Patient endpoints
  getPatientReports(): Observable<any> {
    return this.http.get(`${this.apiUrl}/patient/reports`, {
      headers: this.getAuthHeaders()
    });
  }

  getReport(sessionId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/patient/report/${sessionId}`, {
      headers: this.getAuthHeaders()
    });
  }
  
  sendAudioChunk(queueNumber: number, audioChunk: Blob): Observable<any> {
  const formData = new FormData();
  formData.append('audio_chunk', audioChunk, 'chunk.webm');

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('token')}`
    // 👆 no need for 'Content-Type', FormData handles it
  });

  return this.http.post(`${this.apiUrl}/doctor/session/${queueNumber}/stream`, formData, {
    headers: headers
  });
  }

  getDiagnosis(queueNumber: number): Observable<any> {
  return this.http.post(
    `${this.apiUrl}/doctor/session/${queueNumber}/diagnosis`,
    {},
    { headers: this.getAuthHeaders() }
    );
  }


}