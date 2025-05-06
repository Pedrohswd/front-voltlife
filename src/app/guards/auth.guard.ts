import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    const requiredRoles = route.data['role'] as Array<string>;
    if (requiredRoles) {
      const hasRequiredRole = requiredRoles.some(role => 
        this.authService.hasRole(role)
      );
      
      if (!hasRequiredRole) {
        alert(`Você não tem permissão`);
        return false;
      }
    }

    
    if(this.authService.isTokenExpired()){
      alert(`Token expirou!`);
      this.router.navigate(['/auth/login'])
      return false;
    }

    return true;
  }


} 