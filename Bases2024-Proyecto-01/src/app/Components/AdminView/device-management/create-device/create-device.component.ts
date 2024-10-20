import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Device, DeviceService } from '../../../../Services/Devices/Devices/devices.service';
import { CommonModule } from '@angular/common'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { MatDialogModule } from '@angular/material/dialog'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; 
import { MatButtonModule } from '@angular/material/button'; 
import { MatSelectModule } from '@angular/material/select'; 
import { ProductState, ProductStateService } from '../../../../Services/ProductState/ProductState/product-state.service'; 
import { DeviceType, DeviceTypesService } from '../../../../Services/DeviceTypes/DeviceTypes/device-types.service'; 
import { MatDialog } from '@angular/material/dialog';
import { ErrorMessageComponent } from '../../../error-message/error-message.component';

@Component({
  selector: 'app-create-device',
  templateUrl: './create-device.component.html',
  styleUrls: ['./create-device.component.css'],
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
export class CreateDeviceComponent {
  createDeviceForm: FormGroup; // Reactive form for creating a new device
  deviceTypes: DeviceType[] = []; // List of available device types
  productStates: ProductState[] = []; // List of available product states

  constructor(
    private productStateService: ProductStateService, // Service to get product states
    private deviceTypesService: DeviceTypesService, // Service to get device types
    private dialog: MatDialog, // Service to handle dialogs
    private deviceService: DeviceService, // Service for handling device operations
    private dialogRef: MatDialogRef<CreateDeviceComponent>, // Reference to the current dialog
    @Inject(MAT_DIALOG_DATA) public data: any, // Injected data from parent component
    private fb: FormBuilder // Form builder for creating reactive forms
  ) {
    // Initialize form fields with validators
    this.createDeviceForm = this.fb.group({
      serialNumber: ['', [Validators.required, Validators.min(0)]],
      name: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0)]],
      state: ['', Validators.required],
      brand: ['', Validators.required],
      amountAvailable: ['', [Validators.required, Validators.min(0)]],
      electricalConsumption: ['', [Validators.required, Validators.min(1)]],
      deviceTypeName: ['', Validators.required],
      legalNum: [null],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Fetch device types and product states when the component initializes
    this.deviceTypesService.getDeviceTypes().subscribe((types: DeviceType[]) => {
      this.deviceTypes = types;
    });

    this.productStateService.getProductStates().subscribe((states: ProductState[]) => {
      this.productStates = states;
    });
  }

  onSave(): void {
    // Save new device if the form is valid
    if (this.createDeviceForm.valid) {
      const newDevice: Device = {
        serialNumber: Number(this.createDeviceForm.value.serialNumber),
        name: String(this.createDeviceForm.value.name),
        price: Number(this.createDeviceForm.value.price),
        state: String(this.createDeviceForm.value.state),
        brand: String(this.createDeviceForm.value.brand),
        amountAvailable: Number(this.createDeviceForm.value.amountAvailable),
        electricalConsumption: Number(this.createDeviceForm.value.electricalConsumption),
        deviceTypeName: String(this.createDeviceForm.value.deviceTypeName),
        legalNum: null,
        description: String(this.createDeviceForm.value.description)
      };

      // Check if the serial number is already in use
      if (!this.deviceService.isSerialNumberInUse(newDevice)) {
        this.showErrorDialog('The serial number is already in use. Please choose another.');
        return;
      }

      this.dialogRef.close(newDevice); // Close the dialog and return the new device to the parent component
    }
  }

  showErrorDialog(errorMessage: string): void {
    // Opens a dialog to display an error message
    this.dialog.open(ErrorMessageComponent, {
      width: '400px',
      data: { message: errorMessage }
    });
  }

  onCancel(): void {
    // Close the dialog without performing any action
    this.dialogRef.close();
  }
}
