import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceService } from '../../../../Services/Devices/Devices/devices.service';
import { DistributorService } from '../../../../Services/Distributor/Distributor/distributor.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-edit-assignment',
  templateUrl: './edit-assignment.component.html',
  styleUrls: ['./edit-assignment.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    CommonModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
  ],
})
export class EditAssignmentComponent implements OnInit {
  editAssignmentForm!: FormGroup;
  distributors: any[] = [];
  devices: any[] = [];
  selectedDistributor: any;
  selectedDevice: any;
  selectedDistributorName: string = '';
  selectedDeviceName: string = '';

  constructor(
    private dialogRef: MatDialogRef<EditAssignmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private deviceService: DeviceService,
    private distributorService: DistributorService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadDistributors();
    this.loadDevices();
    this.setExistingData();
  }

  createForm() {
    this.editAssignmentForm = this.fb.group({
      distributor: [null, Validators.required],
      device: [null, Validators.required],
    });

    // Escuchar los cambios en los selectores del formulario
    this.editAssignmentForm
      .get('distributor')
      ?.valueChanges.subscribe((value) => {
        this.selectedDistributor = value;
      });

    this.editAssignmentForm.get('device')?.valueChanges.subscribe((value) => {
      this.selectedDevice = value;
    });
  }

  loadDistributors() {
    this.distributorService.getDistributors().subscribe((distributors) => {
      this.distributors = distributors;
    });
  }

  loadDevices() {
    this.deviceService.getDevices().subscribe((devices) => {
      this.devices = devices;
    });
  }

  getDeviceName(serialNumber: number) {
    return this.deviceService.getDeviceNameBySerial(serialNumber);
  }

  getDistributorName(legalNum: number) {
    return this.distributorService.getDistributorNameById(legalNum);
  }

  setExistingData() {
    // Establecer los valores iniciales del formulario con los datos pasados
    this.editAssignmentForm.patchValue({
      distributor: this.data.legalNum,
      device: this.data.serialNumber,
    });
  }

  onSave() {
    if (this.editAssignmentForm.valid) {
      // Uso de forkJoin para esperar a que ambos observables terminen
      forkJoin({
        distributorName: this.getDistributorName(this.selectedDistributor),
        deviceName: this.getDeviceName(this.selectedDevice),
      }).subscribe(({ distributorName, deviceName }) => {
        const updatedAssignment = {
          ...this.data,
          legalNum: this.selectedDistributor, // ID del distribuidor seleccionado
          serialNumber: this.selectedDevice, // ID del dispositivo seleccionado
          distributorName, // Nombre del distribuidor obtenido
          deviceName, // Nombre del dispositivo obtenido
        };

        // Cerrar el diálogo con los datos actualizados
        this.dialogRef.close(updatedAssignment);
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
