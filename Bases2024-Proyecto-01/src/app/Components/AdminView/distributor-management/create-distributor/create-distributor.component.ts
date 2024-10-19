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
    // Obtener las regiones del servicio
    this.distributorService.getRegions().subscribe((regions: Region[]) => {
      this.regions = regions;
    });

    // Inicializar el formulario
    this.createDistributorForm = this.fb.group({
      legalNum: ['', [Validators.required]], // Campo habilitado para ingresar la cédula jurídica
      name: ['', [Validators.required]],
      region: ['', [Validators.required]], // Desplegable para seleccionar la región
      country: [{ value: '', disabled: true }, Validators.required], // Inicializar como deshabilitado
      continent: [{ value: '', disabled: true }, Validators.required], // Inicializar como deshabilitado
    });
  }

  onRegionSelected(region: string): void {
    const selectedRegion = this.regions.find(r => r.region === region);
    
    if (selectedRegion) {
      // Actualizar los campos de país y continente en el formulario
      this.createDistributorForm.patchValue({
        country: selectedRegion.country,
        continent: selectedRegion.continent,
      });
    }
  }
  
  onSave(): void {
    if (this.createDistributorForm.valid) {
      const newDistributor: Distributor = {
        legalNum: this.createDistributorForm.get('legalNum')?.value,
        name: this.createDistributorForm.get('name')?.value,
        region: this.createDistributorForm.get('region')?.value,
        country: this.createDistributorForm.get('country')?.value,
        continent: this.createDistributorForm.get('continent')?.value
      };

      // Verificar si el número de cédula jurídica ya está en uso
      if (!this.distributorService.isLegalNumInUse(newDistributor)) {
        this.showErrorDialog('La cédula jurídica ya está en uso. Por favor, ingresa otro número.');
        return;
      }

      // Si la cédula jurídica no está en uso, continuar con la creación
      this.dialogRef.close(newDistributor);
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
