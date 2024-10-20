import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DeviceService } from '../../../../Services/Devices/Devices/devices.service';
import { DistributorService } from '../../../../Services/Distributor/Distributor/distributor.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-create-assignment',
  templateUrl: './create-assignment.component.html',
  styleUrls: ['./create-assignment.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    CommonModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
  ]
})
export class CreateAssignmentComponent implements OnInit {
  createAssignmentForm!: FormGroup;
  distributors: any[] = [];
  devices: any[] = [];

  selectedDistributor: any;
  selectedDeviceType: any;
  selectedDevice: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateAssignmentComponent>,
    private deviceService: DeviceService,
    private distributorService: DistributorService
  ) {
    this.createAssignmentForm = this.fb.group({
      distributor: ['', Validators.required],
      device: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Load distributors and devices when the component initializes
    this.loadDistributors();
    this.loadDevices();
    
  }

  // Method to load distributors from the distributor service
  loadDistributors(): void {
    this.distributorService.getDistributors().subscribe((data: any[]) => {
      this.distributors = data;
    });
  }

  // Method to load devices from the device service
  loadDevices(): void {
    this.deviceService.getDevices().subscribe((data: any[]) => {
      this.devices = data;
    });
  }

  // Method to close the dialog without taking any action
  onCancel(): void {
    this.dialogRef.close();
  }

  // Method to confirm the creation of an assignment
  onCreate(): void {
    const assignmentData = {
      distributor: this.selectedDistributor,
      device: this.selectedDevice
    };
    this.dialogRef.close(assignmentData);  // Devolver los datos seleccionados
  }
}
