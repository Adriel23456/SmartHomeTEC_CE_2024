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
  styleUrls: ['./authentication.component.css'] // Asegúrate de que el estilo esté en plural
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

  showErrorDialog(errorMessage: string): void {
    this.dialog.open(ErrorMessageComponent, {
      width: '400px',
      data: { message: errorMessage },
    });
  }

  getDomain(email: string): string {
    const parts = email.split('@');
    return parts.length > 1 ? parts[1] : '';
  }

  onLogin(): void {
    this.authenticationService.login(this.email, this.password).subscribe(email => {
      if (email) { // Verifica que email es válido
        const domain = this.getDomain(email);
        if (domain === 'smartHomeAdmin.com') {
          this.router.navigate(['/sidenavAdmin']);
        } else {
          this.router.navigate(['/sidenavClient']);
        }
      } else {
        const message = 'Error de Autenticación, credenciales inválidas. Por favor, intente de nuevo.';
        this.showErrorDialog(message);
      }
    }, error => {
      // Maneja el error en el suscriptor
      this.showErrorDialog('Error de Autenticación, credenciales inválidas. Por favor, intente de nuevo.');
    });
  }    

  /**
   * Abre el diálogo para registrar un nuevo cliente y maneja la operación de registro.
   */
  onRegister(): void {
    const dialogRef = this.dialog.open(CreateClientComponent, {
      width: '600px',
      height: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clientService.addClient(result).pipe(
          tap((newClient) => {
            // Manejar el éxito, por ejemplo, mostrar una notificación
            console.log('Cliente agregado exitosamente:', newClient);
            // Puedes agregar aquí lógica adicional, como actualizar una lista de clientes
          }),
          catchError((error) => {
            // Manejar el error, por ejemplo, mostrar una notificación de error
            console.error('Error al agregar el cliente:', error);
            // Retornar un observable vacío o manejar el error según tus necesidades
            return of(null);
          })
        ).subscribe();
      }
    });
  }
}
