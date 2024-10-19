import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from "@angular/router";
import { ApiService } from '../../../Services/Comunication/api-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<any | null>;
  public currentUser: Observable<any | null>;

  constructor(private router: Router, private apiService: ApiService) {
    const userJson = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<any | null>(userJson ? JSON.parse(userJson) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any | null {
    return this.currentUserSubject.value;
  }

  /**
   * Login para Admin o Client.
   * @param email Email del usuario.
   * @param password Contraseña del usuario.
   * @returns Observable que devuelve solo el email si el login es exitoso.
   */
  login(email: string, password: string): Observable<string | null> {
    // Intentamos el login primero como Admin
    return this.apiService.loginAdmin({ email, password }).pipe(
      map((admin) => {
        if (admin) {
          this.storeUser(admin);
          return admin.email; // Devuelve el email si es admin
        }
        return null;
      }),
      catchError(error => {
        // Si el login como admin falla, intentamos como Client
        return this.apiService.loginClient({ email, password }).pipe(
          map((client) => {
            if (client) {
              this.storeUser(client);
              return client.email; // Devuelve el email si es client
            }
            return null;
          }),
          catchError(err => this.handleError('Login', err))
        );
      })
    );
  }

  /**
   * Almacena la información del usuario en localStorage.
   * @param user El objeto del usuario que puede ser Admin o Client.
   */
  private storeUser(user: any): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  /**
   * Elimina la información del usuario y redirige al login.
   */
  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  /**
   * Maneja los errores de las solicitudes HTTP.
   * @param operation Operación que falló.
   * @param error Error ocurrido.
   * @returns Un Observable con un mensaje de error.
   */
  private handleError(operation: string, error: any): Observable<never> {
    console.error(`${operation} falló: ${error.message}`);
    return throwError(() => new Error(`${operation} falló: ${error.message}`));
  }
}