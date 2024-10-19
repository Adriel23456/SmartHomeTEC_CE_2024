import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceType, DeviceTypesService } from '../../../../../Services/DeviceTypes/DeviceTypes/device-types.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ErrorMessageComponent } from '../../../../error-message/error-message.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-edit-type',
  templateUrl: './edit-type.component.html',
  styleUrls: ['./edit-type.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class EditTypeComponent {
  editTypeForm: FormGroup;

  constructor(
    private dialog: MatDialog,
    private deviceTypeService: DeviceTypesService,
    private dialogRef: MatDialogRef<EditTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { deviceType: DeviceType },
    private fb: FormBuilder
  ) {
    this.editTypeForm = this.fb.group({
      name: [data.deviceType.name, [Validators.required]],
      warranty: [data.deviceType.warrantyDays, [Validators.required, Validators.min(0)]],
      description: [data.deviceType.description, Validators.required]
    });
  }

  onSave(): void {
    if (this.editTypeForm.valid) {
      const updatedDeviceType: DeviceType = {
        name: String(this.editTypeForm.value.name),
        description: String(this.editTypeForm.value.description),
        warrantyDays: Number(this.editTypeForm.value.warranty)
      };

      // Verificar si el nombre del tipo ya está en uso
      if (!this.deviceTypeService.isTypeNameInUse(updatedDeviceType)) {
        this.showErrorDialog('El nombre del tipo de dispositivo ya está en uso. Por favor, elige otro.');
        return;
      }

      this.dialogRef.close(updatedDeviceType); // Retorna el tipo de dispositivo actualizado
    }
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
}

