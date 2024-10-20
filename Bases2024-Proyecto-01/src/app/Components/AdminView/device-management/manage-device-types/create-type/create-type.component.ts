import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceType, DeviceTypesService } from '../../../../../Services/DeviceTypes/DeviceTypes/device-types.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ErrorMessageComponent } from '../../../../error-message/error-message.component';

@Component({
  selector: 'app-create-type',
  templateUrl: './create-type.component.html',
  styleUrls: ['./create-type.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ]
})
export class CreateTypeComponent {
  createTypeForm: FormGroup;

  constructor(
    private dialog: MatDialog,
    private deviceTypeService: DeviceTypesService,
    private dialogRef: MatDialogRef<CreateTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.createTypeForm = this.fb.group({
      name: ['', [Validators.required]],
      warranty: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
    });
  }

  // Save the new device type when the form is valid
  onSave(): void {
    if (this.createTypeForm.valid) {
      const newDeviceType: DeviceType = {
        name: String(this.createTypeForm.value.name), 
        description: String(this.createTypeForm.value.description), 
        warrantyDays: Number(this.createTypeForm.value.warranty), 
      };

      // Check if the device type name is already in use
      if (!this.deviceTypeService.isTypeNameInUse(newDeviceType)) {
        this.showErrorDialog('El nombre ingresado ya está en uso. Por favor, elige otro.');
        return;
      }

      // Close the dialog and return the new device type to the parent component
      this.dialogRef.close(newDeviceType); 
    }
  }
  
  // Open a dialog to show an error message
  showErrorDialog(errorMessage: string): void {
    this.dialog.open(ErrorMessageComponent, {
      width: '400px',
      data: { message: errorMessage } // Pass the error message to the dialog
    });
  }

  // Cancel the process and close the dialog without saving
  onCancel(): void {
    this.dialogRef.close();
  }
}
