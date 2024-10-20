import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { Distributor, DistributorService, Region } from '../../../../Services/Distributor/Distributor/distributor.service';

@Component({
  selector: 'app-edit-distributor',
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
  templateUrl: './edit-distributor.component.html',
  styleUrls: ['./edit-distributor.component.css']
})
export class EditDistributorComponent implements OnInit {
  editDistributorForm!: FormGroup;
  regions: Region[] = [];

  constructor(// Constructor for the component
    private distributorService: DistributorService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditDistributorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { distributor: Distributor },
  ) {}

  // Lifecycle method that runs on initialization
  ngOnInit(): void {

    // Fetch regions from the service
    this.distributorService.getRegions().subscribe((regions: Region[]) => {
      console.log('regiones disponibles: ', regions);
      this.regions = regions;
    });

    // Initialize the form with validations
    this.editDistributorForm = this.fb.group({
      legalNum: [{value: this.data.distributor.legalNum, disabled: true}, [Validators.required]],
      name: [this.data.distributor.name, [Validators.required]],
      region: [this.data.distributor.region, [Validators.required]], // Desplegable para seleccionar la región
      country: [{ value: this.data.distributor.country, disabled: true }, Validators.required], // Inicializar como deshabilitado
      continent: [{ value: this.data.distributor.continent, disabled: true }, Validators.required], // Inicializar como deshabilitado
    });
  }

  onRegionSelected(region: string): void { // Method to handle region selection
    const selectedRegion = this.regions.find(r => r.region === region);
    
    if (selectedRegion) {
      // Update the country and continent fields in the form
      this.editDistributorForm.patchValue({
        country: selectedRegion.country,
        continent: selectedRegion.continent,
      });
    }
  }

  onSave(): void { // Method to save the distributor changes
    if (this.editDistributorForm.valid) {
      // Manually assign the fields
      const updatedDistributor: Distributor = {
        legalNum: this.data.distributor.legalNum, 
        name: this.editDistributorForm.get('name')?.value,
        region: this.editDistributorForm.get('region')?.value,
        country: this.editDistributorForm.get('country')?.value,
        continent: this.editDistributorForm.get('continent')?.value
      };
      this.dialogRef.close(updatedDistributor); 
      }
    }
  

  onCancel(): void { // Method to cancel the editing process
    this.dialogRef.close();
  }
}