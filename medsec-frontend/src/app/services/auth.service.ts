import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { UserCreate, UserLogin, Token } from '../models/user.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    if (token && userType) {
      this.currentUserSubject.next({ userType });
    }
  }

  login(credentials: UserLogin): Observable<Token> {
    return this.apiService.login(credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('userType', response.user_type);
        this.currentUserSubject.next({ userType: response.user_type });
        
        // Navigate based on user type
        if (response.user_type === 'doctor') {
          this.router.navigate(['/doctor/dashboard']);
        } else {
          this.router.navigate(['/patient/dashboard']);
        }
      })
    );
  }

  register(userData: UserCreate): Observable<Token> {
    return this.apiService.register(userData).pipe(
      tap(response => {
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('userType', response.user_type);
        this.currentUserSubject.next({ userType: response.user_type });
        
        // Navigate based on user type
        if (response.user_type === 'doctor') {
          this.router.navigate(['/doctor/dashboard']);
        } else {
          this.router.navigate(['/patient/dashboard']);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserType(): string | null {
    return localStorage.getItem('userType');
  }

  isDoctor(): boolean {
    return this.getUserType() === 'doctor';
  }

  isPatient(): boolean {
    return this.getUserType() === 'patient';
  }
}
