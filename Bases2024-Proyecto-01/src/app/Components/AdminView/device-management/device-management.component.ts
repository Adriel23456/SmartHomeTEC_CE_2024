import { Component, OnInit } from '@angular/core';
import { DeviceService, Device } from '../../../Services/Devices/Devices/devices.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { Client, ClientService } from '../../../Services/Clients/Clients/clients.service';
import { Observable, catchError, forkJoin, map, of, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditDeviceComponent } from './edit-device/edit-device.component';
import { ManageDeviceTypesComponent } from './manage-device-types/manage-device-types.component';
import { CreateDeviceComponent } from './create-device/create-device.component';
import { DeleteDialogComponent } from '../../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-device-management',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    CommonModule,
    MatToolbarModule, 
    MatIconModule
  ],
  templateUrl: './device-management.component.html',
  styleUrl: './device-management.component.css'
})
export class DeviceManagementComponent implements OnInit{
  router = inject(Router);
  devices: Device[] = [];
  clients: Client[] = [];
  clientEmail: string = '';
  deviceClientEmails: { [serialNumber: number]: string } = {};
  deviceAssignmentStatus: { [serialNumber: number]: boolean } = {};
  

  constructor(
    private deviceService: DeviceService,
    private clientService: ClientService,
    private dialog: MatDialog,
  ){}

  ngOnInit(): void {
    this.refreshDevices();
  }

  isDeviceAssigned(device: Device): Observable<boolean> {
    const operation = `GET ClientEmail by SerialNumber: ${device.serialNumber}`;
    return this.clientService.getClientEmailBySerial(device.serialNumber).pipe(
      map((emailAddress: string) => emailAddress === 'No asignado'),
      tap((isAssigned: boolean) => {
        const message = isAssigned ? 'El dispositivo no está asignado.' : 'El dispositivo está asignado.';
        console.log(`${operation} - Resultado:`, message);
      }),
      catchError((error) => {
        console.error(`${operation} falló:`, error);
        // Devuelve `false` en caso de error para continuar el flujo de la aplicación
        return of(false);
      })
    );
  }  

  getPowerConsumption(device: Device): Observable<number> {
    return of(device.electricalConsumption);
  }
  
  getClientEmail(serialNumber: number): Observable<string> {
    const operation = `GET ClientEmail by SerialNumber: ${serialNumber}`;
    return this.clientService.getClientEmailBySerial(serialNumber).pipe(
      map(email => email || "No asignado"),  // Si el email es falsy (null, undefined, etc.), devuelve 'No asignado'
      tap(email => console.log(`${operation} - Resultado: ${email}`)),  // Registrar el resultado
      catchError(() => {
        console.error(`${operation} falló. Retornando 'No asignado'.`);
        return of('No asignado');  // En caso de error, devuelve 'No asignado'
      })
    );
  }

  // Editar un dispositivo
  editDevice(device: Device) {
    // Guardar una copia del dispositivo original antes de abrir el diálogo
    const originalDevice = { ...device }; // Copia del dispositivo original
    if (this.deviceAssignmentStatus[device.serialNumber]) {
      const dialogRef = this.dialog.open(EditDeviceComponent, {
        width: '600px',
        data: { device }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.deviceService.updateDevice(originalDevice, result).pipe(
            tap(() => {
              console.log('Dispositivo actualizado exitosamente.');
              this.refreshDevices(); // Actualizar la lista de dispositivos
            }),
            catchError(error => {
              console.error('Error al actualizar el dispositivo:', error);
              // Retornar un observable vacío para completar la cadena sin interrumpir
              return of(null);
            })
          ).subscribe();
        }
      });
    } else {
      console.log('El dispositivo está asignado y no se puede editar.');
    }
  }

  // Función para agregar un nuevo dispositivo
  addDevice() {
    const dialogRef = this.dialog.open(CreateDeviceComponent, {
      width: '600px',
      height: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deviceService.addDevice(result).pipe(
          tap(() => {
            console.log('Dispositivo agregado exitosamente.');
            this.refreshDevices(); // Actualizar la lista de dispositivos
          }),
          catchError(error => {
            console.error('Error al agregar el dispositivo:', error);
            // Retornar un observable vacío para completar la cadena sin propagar el error
            return of(null);
          })
        ).subscribe();
      }
    });
  }

  onDelete(device: Device): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data: { message: `¿Seguro que quieres borrar el dispositivo: ${device.name} - ${device.serialNumber}?` }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Verificar si el dispositivo no está asignado utilizando `deviceAssignmentStatus`
        if (this.deviceAssignmentStatus[device.serialNumber]) {
          // Llamar al servicio para eliminar el dispositivo y proteger la llamada con pipe, tap y catchError
          this.deviceService.deleteDevice(device).pipe(
            tap(() => {
              console.log('Dispositivo eliminado exitosamente.');
              this.refreshDevices(); // Actualizar la lista de dispositivos
            }),
            catchError(error => {
              console.error('Error al eliminar el dispositivo:', error);
              // Retornar un observable vacío para completar la cadena sin interrumpir
              return of(null);
            })
          ).subscribe();
        } else {
          console.log('El dispositivo está asignado y no se puede eliminar.');
        }
      } else {
        console.log('Acción de borrar cancelada');
      }
    });
  }

  // Función para gestionar tipos de dispositivos
  manageDeviceTypes() {
    const dialogRef = this.dialog.open(ManageDeviceTypesComponent, {
      width: '600px',
      height: '500px',
      data: {
        deviceType: {}, // Puedes pasar datos aquí si lo deseas
        isEditMode: true // Indica si es modo edición
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo se cerró', result);
    });
  }

  refreshDevices() {
    const operation = 'GET Devices';
    
    this.deviceService.getDevices().pipe(
      tap((data) => {
        console.log(`${operation} - Datos recibidos:`, data);  // Registrar los datos recibidos
      }),
      catchError((error) => {
        console.error(`${operation} falló:`, error);  // Registrar cualquier error
        return of([]);  // Devolver una lista vacía en caso de error
      })
    ).subscribe((data) => {
      this.devices = data;  // Asignar los dispositivos obtenidos a la propiedad
      this.loadDeviceClientEmailsAndAssignments();
    });
  }

  loadDeviceClientEmailsAndAssignments() {
    const observables = this.devices.map(device => {
      const serialNumber = device.serialNumber;
  
      // Obtener el email del cliente y el estado de asignación
      return this.clientService.getClientEmailBySerial(serialNumber).pipe(
        map(email => {
          const clientEmail = email || "No asignado";
          const isAssigned = clientEmail === 'No asignado';
          this.deviceClientEmails[serialNumber] = clientEmail;
          this.deviceAssignmentStatus[serialNumber] = isAssigned;
        }),
        catchError(() => {
          this.deviceClientEmails[serialNumber] = 'No asignado';
          this.deviceAssignmentStatus[serialNumber] = false;
          return of(null);
        })
      );
    });
  
    // Esperar a que todos los observables se completen
    forkJoin(observables).subscribe(() => {
      console.log('Emails y estados de asignación cargados');
    });
  }
}

