import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from '../../../Services/Authentication/Authentication/authentication.service';
import { DialogComponent } from '../dialog/dialog.component';
import { FormsModule } from "@angular/forms";
import { CommonModule, NgIf } from '@angular/common';
import { ErrorMessageComponent } from '../../error-message/error-message.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CreateClientComponent } from '../create-client/create-client.component';
import { ClientService } from '../../../Services/Clients/Clients/clients.service';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NgIf,
    DialogComponent,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css'] 
})
export class AuthenticationComponent {
  email: string = '';
  password: string = '';
  router = inject(Router);

  constructor(
    private clientService: ClientService,
    private authenticationService: AuthenticationService,
    private dialog: MatDialog
  ) {}
//Displays an error dialog with the provided error message.
  showErrorDialog(errorMessage: string): void {
    this.dialog.open(ErrorMessageComponent, {
      width: '400px',
      data: { message: errorMessage },
    });
  }
//Extracts the domain part from the email address.
  getDomain(email: string): string {
    const parts = email.split('@');
    return parts.length > 1 ? parts[1] : '';
  }
   //Handles the login action when the user submits their email and password.
   // If login is successful, navigates to the appropriate view based on the email domain.
   
  onLogin(): void {
    this.authenticationService.login(this.email, this.password).subscribe(email => {
      if (email) { // Verifica que email es válido
        const domain = this.getDomain(email);
        if (domain === 'smartHomeAdmin.com') {// Checks if the email domain is for admins
          this.router.navigate(['/sidenavAdmin']);// Navigates to the admin dashboard
        } else {
          this.router.navigate(['/sidenavClient']);// Navigates to the client dashboard
        }
      } else {
        const message = 'Error de Autenticación, credenciales inválidas. Por favor, intente de nuevo.';
        this.showErrorDialog(message);// Shows an error dialog if login fails
      }
    }, error => {
      // Handles login error
      this.showErrorDialog('Error de Autenticación, credenciales inválidas. Por favor, intente de nuevo.');
    });
  }    

  
   // Opens a dialog for client registration and handles the registration process.
    //If registration is successful, it adds the client using the client service.
   
  onRegister(): void {
    const dialogRef = this.dialog.open(CreateClientComponent, {
      width: '600px',
      height: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clientService.addClient(result).pipe(
          tap((newClient) => {
            // Handles successful client creation
            console.log('Cliente agregado exitosamente:', newClient);
          }),
          catchError((error) => {
            // Handles errors during client creation
            console.error('Error al agregar el cliente:', error);
            // Returns an observable in case of an error
            return of(null);
          })
        ).subscribe();
      }
    });
  }
}
