import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService } from '../../Services/Authentication/Authentication/authentication.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    return this.authService.currentUser.pipe(
      map(user => {
        if (user) {
          return true; // Permite el acceso
        } else {
          this.router.navigate(['/login']); // Redirige al login si no está autenticado
          return false; // Bloquea el acceso
        }
      })
    );
  }
}
