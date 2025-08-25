import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let route: ActivatedRouteSnapshot;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'getUserType']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    authGuard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    route = new ActivatedRouteSnapshot();
  });

  it('should allow activation if user is authenticated and no role required', () => {
    authService.isAuthenticated.and.returnValue(true);

    const result = authGuard.canActivate(route);

    expect(result).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to /login if user is not authenticated', () => {
    authService.isAuthenticated.and.returnValue(false);

    const result = authGuard.canActivate(route);

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should allow activation if user has the required role', () => {
    authService.isAuthenticated.and.returnValue(true);
    authService.getUserType.and.returnValue('doctor');
    (route as any).data = { role: 'doctor' };

    const result = authGuard.canActivate(route);

    expect(result).toBeTrue();
  });

  it('should redirect to /unauthorized if user role does not match', () => {
    authService.isAuthenticated.and.returnValue(true);
    authService.getUserType.and.returnValue('patient');
    (route as any).data = { role: 'doctor' };

    const result = authGuard.canActivate(route);

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/unauthorized']);
  });
});
