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
    // Load distributors, devices, and set existing data when the component initializes
    this.loadDistributors();
    this.loadDevices();
    this.setExistingData();
  }

  // Method to create the form with validation rules
  createForm() {
    this.editAssignmentForm = this.fb.group({
      distributor: [null, Validators.required],
      device: [null, Validators.required],
    });

    // Listen for changes in the distributor and device selectors
    this.editAssignmentForm
      .get('distributor')
      ?.valueChanges.subscribe((value) => {
        this.selectedDistributor = value;
      });

    this.editAssignmentForm.get('device')?.valueChanges.subscribe((value) => {
      this.selectedDevice = value;
    });
  }

  // Method to load distributors from the distributor service
  loadDistributors() {
    this.distributorService.getDistributors().subscribe((distributors) => {
      this.distributors = distributors;
    });
  }

  // Method to load devices from the device service
  loadDevices() {
    this.deviceService.getDevices().subscribe((devices) => {
      this.devices = devices;
    });
  }

  // Method to retrieve the device name by its serial number
  getDeviceName(serialNumber: number) {
    return this.deviceService.getDeviceNameBySerial(serialNumber);
  }

  // Method to retrieve the distributor name by its legal number
  getDistributorName(legalNum: number) {
    return this.distributorService.getDistributorNameById(legalNum);
  }

  // Method to set existing data in the form using data passed to the dialog
  setExistingData() {
    this.editAssignmentForm.patchValue({
      distributor: this.data.legalNum,
      device: this.data.serialNumber,
    });
  }

  // Method to save the updated assignment data
  onSave() {
    if (this.editAssignmentForm.valid) {
      forkJoin({
        distributorName: this.getDistributorName(this.selectedDistributor),
        deviceName: this.getDeviceName(this.selectedDevice),
      }).subscribe(({ distributorName, deviceName }) => {
        const updatedAssignment = {
          ...this.data,
          legalNum: this.selectedDistributor,
          serialNumber: this.selectedDevice,
          distributorName,
          deviceName, 
        };

        this.dialogRef.close(updatedAssignment);
      });
    }
  }

  // Method to close the dialog without saving changes
  onCancel() {
    this.dialogRef.close();
  }
}
