import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Device } from '../../../../Services/Devices/Devices/devices.service'
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DeviceType, DeviceTypesService } from '../../../../Services/DeviceTypes/DeviceTypes/device-types.service';
import { MatSelectModule } from '@angular/material/select';
import { ProductState, ProductStateService } from '../../../../Services/ProductState/ProductState/product-state.service';


@Component({
  selector: 'app-edit-device',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    CommonModule
  ],
  templateUrl: './edit-device.component.html',
  styleUrl: './edit-device.component.css'
})
export class EditDeviceComponent implements OnInit {
  editDeviceForm!: FormGroup;
  selectedDeviceType: DeviceType | null = null;  // Tipo seleccionado
  deviceTypes: DeviceType[] = []; 
  productStates: ProductState[] = [];

  constructor(
    private fb: FormBuilder,
    private deviceTypeService: DeviceTypesService,
    private productStateService: ProductStateService,
    public dialogRef: MatDialogRef<EditDeviceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { device: Device },
  ) {}

  ngOnInit(): void {

    // obtener tipos de dispositivo al inicializar el componente
    this.deviceTypeService.getDeviceTypes().subscribe((types: DeviceType[]) => {
      this.deviceTypes = types;
    });

    this.productStateService.getProductStates().subscribe((states: ProductState[]) => {
      this.productStates = states;
    });

    // Inicializar el formulario con validaciones
    this.editDeviceForm = this.fb.group({
      name: [this.data.device.name, [Validators.required]],
      deviceTypeName: [this.data.device.deviceTypeName, [Validators.required]],
      brand: [this.data.device.brand, [Validators.required]],
      price: [this.data.device.price, [Validators.required, Validators.min(0)]],
      productState: [this.data.device.state, [Validators.required]],
      amountAvailable: [this.data.device.amountAvailable, [Validators.required, Validators.min(0)]],
      electricalConsumption: [this.data.device.electricalConsumption, [Validators.required, Validators.min(1)]],
      description: [this.data.device.description, [Validators.required]],
    });
  }

  onSave(): void {
    if (this.editDeviceForm.valid) {
      const updatedDevice: Device = {
        ...this.data.device,
        ...this.editDeviceForm.value
      };

      this.dialogRef.close(updatedDevice); // Cierra el diálogo y retorna el dispositivo actualizado
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
