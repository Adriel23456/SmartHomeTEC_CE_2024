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
  createDeviceForm: FormGroup;
  deviceTypes: DeviceType[] = []; 
  productStates: ProductState[] = [];

  constructor(
    private productStateService: ProductStateService,
    private deviceTypesService: DeviceTypesService,
    private dialog: MatDialog,
    private deviceService: DeviceService,
    private dialogRef: MatDialogRef<CreateDeviceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
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

    this.deviceTypesService.getDeviceTypes().subscribe((types: DeviceType[]) => {
      this.deviceTypes = types;
    });

    this.productStateService.getProductStates().subscribe((states: ProductState[]) => {
      this.productStates = states;
    });
  }


  onSave(): void {
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

      // Verificar si ya existe un dispositivo con el mismo serial number
      if (!this.deviceService.isSerialNumberInUse(newDevice)) {
        this.showErrorDialog('El número de serie ya está en uso. Por favor, elige otro.');
        return;
      }

      this.dialogRef.close(newDevice); // Cierra el diálogo y pasa el nuevo dispositivo al componente padre
    }
  }

  showErrorDialog(errorMessage: string): void {
    this.dialog.open(ErrorMessageComponent, {
      width: '400px',
      data: { message: errorMessage }
    });
  }

  onCancel(): void {
    this.dialogRef.close(); // Cierra el diálogo sin realizar ninguna acción
  }
}
