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
  
   // Initializes required services and sets default values
  constructor(
    private deviceService: DeviceService,
    private clientService: ClientService,
    private dialog: MatDialog,
  ){}

  // Initializes component and fetches device data when the component loads
  ngOnInit(): void {
    this.refreshDevices();
  }

  // Checks if a device is assigned to a client by its serial number and returns an observable boolean
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
        // Return false on error to proceed with application flow
        return of(false);
      })
    );
  }  

  // Retrieves the power consumption of a device and returns it as an observable number
  getPowerConsumption(device: Device): Observable<number> {
    return of(device.electricalConsumption);
  }
  
  // Fetches the email of the client to whom a device is assigned by serial number
  getClientEmail(serialNumber: number): Observable<string> {
    const operation = `GET ClientEmail by SerialNumber: ${serialNumber}`;
    return this.clientService.getClientEmailBySerial(serialNumber).pipe(
      map(email => email || "No asignado"),  // if email is falsy (null, undefined, etc.), return 'No asignado'
      tap(email => console.log(`${operation} - Resultado: ${email}`)),  // save the result
      catchError(() => {
        console.error(`${operation} falló. Retornando 'No asignado'.`);
        return of('No asignado');  // On error, returns 'Not assigned'
      })
    );
  }

  // Opens a dialog to edit a device, checks assignment status before allowing the edit
  editDevice(device: Device) {
    // Make a copy of the device before opening the dialog
    const originalDevice = { ...device }; 
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
              this.refreshDevices(); // update the device list
            }),
            catchError(error => {
              console.error('Error al actualizar el dispositivo:', error);
              // Return an empty observable to complete the chain without interrupting
              return of(null);
            })
          ).subscribe();
        }
      });
    } else {
      console.log('El dispositivo está asignado y no se puede editar.');
    }
  }

  // Opens a dialog to add a new device and updates the list after the device is added
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
            this.refreshDevices(); //update the decive list
          }),
          catchError(error => {
            console.error('Error al agregar el dispositivo:', error);
            // Return an empty observable to complete the chain without interrupting
            return of(null);
          })
        ).subscribe();
      }
    });
  }

  // Opens a dialog to confirm the deletion of a device and removes it if confirmed and not assigned
  onDelete(device: Device): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data: { message: `¿Seguro que quieres borrar el dispositivo: ${device.name} - ${device.serialNumber}?` }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Check if the device is not assigned using `deviceAssignmentStatus`
        if (this.deviceAssignmentStatus[device.serialNumber]) {
          // Call the service to remove the device and protect the call with pipe, tap and catchError
          this.deviceService.deleteDevice(device).pipe(
            tap(() => {
              console.log('Dispositivo eliminado exitosamente.');
              this.refreshDevices(); // Update the device list
            }),
            catchError(error => {
              console.error('Error al eliminar el dispositivo:', error);
              // Return an empty observable to complete the chain without interrupting
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

  // Opens a dialog to manage device types (e.g., editing or adding new types)
  manageDeviceTypes() {
    const dialogRef = this.dialog.open(ManageDeviceTypesComponent, {
      width: '600px',
      height: '500px',
      data: {
        deviceType: {}, 
        isEditMode: true 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo se cerró', result);
    });
  }

  // Fetches and updates the list of devices, logs the result, and handles errors
  refreshDevices() {
    const operation = 'GET Devices';
    
    this.deviceService.getDevices().pipe(
      tap((data) => {
        console.log(`${operation} - Datos recibidos:`, data);  // Record the received data
      }),
      catchError((error) => {
        console.error(`${operation} falló:`, error);  // Log any errors
        return of([]);  // Return an empty list on error
      })
    ).subscribe((data) => {
      this.devices = data;  // Assign the obtained devices to the property
      this.loadDeviceClientEmailsAndAssignments();
    });
  }

  // Loads the client email and assignment status for each device and stores the results in dictionaries
  loadDeviceClientEmailsAndAssignments() {
    const observables = this.devices.map(device => {
      const serialNumber = device.serialNumber;
  
      //function to get the client's email and the assignment status
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
  
    // Wait for all observables to complete
    forkJoin(observables).subscribe(() => {
      console.log('Emails y estados de asignación cargados');
    });
  }
}

