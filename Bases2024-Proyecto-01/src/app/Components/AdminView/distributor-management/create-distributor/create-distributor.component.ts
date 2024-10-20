import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DistributorService, Distributor, Region } from '../../../../Services/Distributor/Distributor/distributor.service';
import { ErrorMessageComponent } from '../../../error-message/error-message.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-create-distributor',
  templateUrl: './create-distributor.component.html',
  styleUrls: ['./create-distributor.component.css'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatSelectModule,
  ],
})
export class CreateDistributorComponent implements OnInit {
  createDistributorForm!: FormGroup;
  regions: Region[] = [];

  constructor(
    private dialog: MatDialog,
    private distributorService: DistributorService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateDistributorComponent>
  ) {}

  ngOnInit(): void {
    // Fetch the list of regions from the distributor service when the component initializes
    this.distributorService.getRegions().subscribe((regions: Region[]) => {
      this.regions = regions;
    });

    // Initialize the create distributor form with form controls and validation
    this.createDistributorForm = this.fb.group({
      legalNum: ['', [Validators.required]], 
      name: ['', [Validators.required]],
      region: ['', [Validators.required]], 
      country: [{ value: '', disabled: true }, Validators.required], 
      continent: [{ value: '', disabled: true }, Validators.required], 
    });
  }

  // This function is triggered when the user selects a region from the dropdown
  onRegionSelected(region: string): void {
    const selectedRegion = this.regions.find(r => r.region === region);
    
    if (selectedRegion) {
      // Update the country and continent fields in the form based on the selected region
      this.createDistributorForm.patchValue({
        country: selectedRegion.country,
        continent: selectedRegion.continent,
      });
    }
  }
  
  // This function is triggered when the user clicks the save button
  onSave(): void {
    if (this.createDistributorForm.valid) {
      const newDistributor: Distributor = {
        legalNum: this.createDistributorForm.get('legalNum')?.value,
        name: this.createDistributorForm.get('name')?.value,
        region: this.createDistributorForm.get('region')?.value,
        country: this.createDistributorForm.get('country')?.value,
        continent: this.createDistributorForm.get('continent')?.value
      };

      // Check if the legal number is already in use
      if (!this.distributorService.isLegalNumInUse(newDistributor)) {
        this.showErrorDialog('La cédula jurídica ya está en uso. Por favor, ingresa otro número.');
        return;
      }

      // If the legal number is not in use, close the dialog and pass the new distributor object to the parent
      this.dialogRef.close(newDistributor);
    }
  }

  // This function opens a dialog to display an error message
  showErrorDialog(errorMessage: string): void {
    this.dialog.open(ErrorMessageComponent, {
      width: '400px',
      data: { message: errorMessage }
    });
  }

  // This function is triggered when the user cancels the form submission
  onCancel(): void {
    this.dialogRef.close();
  }
}
