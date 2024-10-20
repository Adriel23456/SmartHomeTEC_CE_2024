import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { DeviceType, DeviceTypesService } from '../../../../Services/DeviceTypes/DeviceTypes/device-types.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CreateTypeComponent } from './create-type/create-type.component';
import {EditTypeComponent} from './edit-type/edit-type.component'
import { DeleteDialogComponent } from '../../../delete-dialog/delete-dialog.component';
import { ErrorMessageComponent } from '../../../error-message/error-message.component';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-manage-device-types',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    CommonModule
  ],
  templateUrl: './manage-device-types.component.html',
  styleUrl: './manage-device-types.component.css'
})
export class ManageDeviceTypesComponent {

  selectedDeviceType: DeviceType | null = null;  
  deviceTypes: DeviceType[] = []; 
  deviceType: DeviceType;
  isEditMode: boolean;

  constructor(
    private dialog: MatDialog,
    private deviceTypeService: DeviceTypesService,
    public dialogRef: MatDialogRef<ManageDeviceTypesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { deviceType: DeviceType, isEditMode: boolean }
  ) {
    this.deviceType = { ...data.deviceType };  
    this.isEditMode = data.isEditMode;
  }

  ngOnInit(): void {
    // Fetch the list of device types when the component initializes
    this.refreshDeviceTypes();
  }

  onDeleteType(selectedDeviceType: DeviceType): void {
    // Deletes the selected device type if it's not in use
    if (this.selectedDeviceType) {
      if(this.deviceTypeService.isTypeNameInUse(this.selectedDeviceType)){
        // Open confirmation dialog before deleting the device type
        const dialogRef = this.dialog.open(DeleteDialogComponent, {
          width: '400px',
          data: { message: `¿Seguro que quieres borrar el tipo: ${selectedDeviceType.name}?` }
        });
      
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            // User confirmed the deletion
            this.deviceTypeService.deleteDeviceType(selectedDeviceType).pipe(
              tap(() => {
                console.log('Tipo de dispositivo eliminado exitosamente.');
                this.refreshDeviceTypes(); // Refresh the list of device types after deletion
                this.selectedDeviceType = null; // Reset the selected device type
              }),
              catchError((error) => {
                console.error('Error al eliminar el tipo de dispositivo:', error);
                // Return an empty observable to continue the stream without errors
                return of(null);
              })
            ).subscribe();
          } else {
            // User cancelled the deletion action
            console.log('Acción de borrar cancelada');
          }
        });

      } else{
         // If the device type is in use, show an error message dialog
        this.showErrorDialog('No se puede eliminar el tipo de dispositivo porque está en uso.');
        return;
      }
    }; 
  }

  showErrorDialog(errorMessage: string): void {
    // Opens a dialog to display an error message
    this.dialog.open(ErrorMessageComponent, {
      width: '400px',
      data: { message: errorMessage }
    });
  }

  onCancel(): void {
    // Closes the current dialog without taking action
    this.dialogRef.close();
  }

  onCreateType(): void{
    // Opens the dialog for creating a new device type
    const dialogRef = this.dialog.open(CreateTypeComponent, {
      width: '600px',
      height: '500px',
      data: {
        deviceType: {}, 
        isEditMode: false
      }
    });
    // Executes after the dialog is closed
    dialogRef.afterClosed().subscribe(result => {
      if (result) { 
        console.log('El diálogo se cerró con un resultado:', result);
        this.deviceTypeService.addDeviceType(result).pipe(
          tap(() => {
            console.log('Tipo de dispositivo agregado exitosamente.');
            this.refreshDeviceTypes();
          }),
          catchError((error) => {
            console.error('Error al agregar el tipo de dispositivo:', error);
            return of(null);
          })
        ).subscribe();
      }
    });
  }

  refreshDeviceTypes() {
    this.deviceTypeService.getDeviceTypes().pipe(
      // Fetches the list of available device types
      tap((types: DeviceType[]) => {
        console.log('Tipos de dispositivo obtenidos:', types);
      }),
      catchError((error) => {
        console.error('Error al obtener los tipos de dispositivo:', error);
        return of([]);
      })
    ).subscribe((types: DeviceType[]) => {
      this.deviceTypes = types; 
    });
  }

  onEditType(): void {
    if (this.selectedDeviceType) {
      // Saves a copy of the original device type before editing
      const originalType = { ...this.selectedDeviceType }; 

      const dialogRef = this.dialog.open(EditTypeComponent, {
        width: '600px',
        height: '500px',
        data: {
          deviceType: { ...this.selectedDeviceType } // Pass a copy of the selected device type to the dialog
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Updates the device type in the database using the service
          this.deviceTypeService.updateDeviceType(originalType, result).pipe(
            tap(() => {
              console.log('Tipo de dispositivo actualizado exitosamente.');
              this.refreshDeviceTypes();  
            }),
            catchError(error => {
              console.error('Error al actualizar el tipo de dispositivo:', error);
              // Return an empty observable to complete the stream
              return of(null);
            })
          ).subscribe();
        }
      });
    }
  }
}
