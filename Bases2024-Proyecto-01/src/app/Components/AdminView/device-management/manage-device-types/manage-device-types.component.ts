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

  selectedDeviceType: DeviceType | null = null;  // Tipo seleccionado
  deviceTypes: DeviceType[] = []; 
  deviceType: DeviceType;
  isEditMode: boolean;

  constructor(
    private dialog: MatDialog,
    private deviceTypeService: DeviceTypesService,
    public dialogRef: MatDialogRef<ManageDeviceTypesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { deviceType: DeviceType, isEditMode: boolean }
  ) {
    this.deviceType = { ...data.deviceType };  // Hacemos una copia del tipo
    this.isEditMode = data.isEditMode;
  }

  ngOnInit(): void {
    // obtener tipos de dispositivo al inicializar el componente
    this.refreshDeviceTypes();
  }

  onDeleteType(selectedDeviceType: DeviceType): void {
    if (this.selectedDeviceType) {
      if(this.deviceTypeService.isTypeNameInUse(this.selectedDeviceType)){

        const dialogRef = this.dialog.open(DeleteDialogComponent, {
          width: '400px',
          data: { message: `¿Seguro que quieres borrar el tipo: ${selectedDeviceType.name}?` }
        });
      
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            // El usuario confirmó que desea borrar
            this.deviceTypeService.deleteDeviceType(selectedDeviceType).pipe(
              tap(() => {
                console.log('Tipo de dispositivo eliminado exitosamente.');
                this.refreshDeviceTypes(); // Refrescar la lista
                this.selectedDeviceType = null; // reinicia el desplegable
              }),
              catchError((error) => {
                console.error('Error al eliminar el tipo de dispositivo:', error);
                // Retornar un observable vacío para completar la cadena sin interrumpir
                return of(null);
              })
            ).subscribe();
          } else {
            // El usuario canceló la acción de borrar
            console.log('Acción de borrar cancelada');
          }
        });

      } else{
        this.showErrorDialog('No se puede eliminar el tipo de dispositivo porque está en uso.');
        return;
      }
    }; 
  }

  showErrorDialog(errorMessage: string): void {
    this.dialog.open(ErrorMessageComponent, {
      width: '400px',
      data: { message: errorMessage }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreateType(): void{
    const dialogRef = this.dialog.open(CreateTypeComponent, {
      width: '600px',
      height: '500px',
      data: {
        deviceType: {}, 
        isEditMode: false // Indica si es modo edición
      }
    });
    // Este bloque se ejecuta después de que el diálogo se cierra
    dialogRef.afterClosed().subscribe(result => {
      if (result) { // Si el subcomponente devolvió un nuevo tipo de dispositivo
        console.log('El diálogo se cerró con un resultado:', result);
        // Llamamos al servicio para añadir el nuevo tipo de dispositivo
        this.deviceTypeService.addDeviceType(result).pipe(
          tap(() => {
            console.log('Tipo de dispositivo agregado exitosamente.');
            this.refreshDeviceTypes();
          }),
          catchError((error) => {
            console.error('Error al agregar el tipo de dispositivo:', error);
            // Retornar un observable vacío para completar la cadena sin interrumpir
            return of(null);
          })
        ).subscribe();
      }
    });
  }

  refreshDeviceTypes() {
    this.deviceTypeService.getDeviceTypes().pipe(
      tap((types: DeviceType[]) => {
        console.log('Tipos de dispositivo obtenidos:', types);
      }),
      catchError((error) => {
        console.error('Error al obtener los tipos de dispositivo:', error);
        // Retornar una lista vacía en caso de error
        return of([]);
      })
    ).subscribe((types: DeviceType[]) => {
      this.deviceTypes = types; // Actualizamos la lista de tipos
    });
  }

  onEditType(): void {
    if (this.selectedDeviceType) {
      // Guardar una copia del tipo original antes de abrir el diálogo
      const originalType = { ...this.selectedDeviceType }; // Copia del tipo original

      const dialogRef = this.dialog.open(EditTypeComponent, {
        width: '600px',
        height: '500px',
        data: {
          deviceType: { ...this.selectedDeviceType } // Hacemos una copia del tipo seleccionado para editar
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Lógica para actualizar el tipo de dispositivo en la base de datos, ahora con el original y el actualizado
          this.deviceTypeService.updateDeviceType(originalType, result).pipe(
            tap(() => {
              console.log('Tipo de dispositivo actualizado exitosamente.');
              this.refreshDeviceTypes();  
            }),
            catchError(error => {
              console.error('Error al actualizar el tipo de dispositivo:', error);
              // Retornar un observable vacío para completar la cadena sin interrumpir
              return of(null);
            })
          ).subscribe();
        }
      });
    }
  }
}
