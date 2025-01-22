import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard, Router]  
    });
    authGuard = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });

  it('should allow access if user is logged in', () => {
    localStorage.setItem('isLoggedIn', 'true');
    const canActivate = authGuard.canActivate();
    expect(canActivate).toBeTrue();
  });

  it('should redirect to login if user is not logged in', () => {
    localStorage.setItem('isLoggedIn', 'false');
    spyOn(router, 'navigate'); 

    const canActivate = authGuard.canActivate();

    expect(canActivate).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
