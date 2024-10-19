import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService, Client } from '../../../Services/Clients/Clients/clients.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ErrorMessageComponent } from '../../error-message/error-message.component';
import { MatDialog } from '@angular/material/dialog';
import { DistributorService, Region } from '../../../Services/Distributor/Distributor/distributor.service';

@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.css'],
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

export class CreateClientComponent implements OnInit {
  createClientForm: FormGroup;
  regions: Region[] = []; // Arreglo para almacenar las regiones

  constructor(
    private clientService: ClientService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<CreateClientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private distributorService: DistributorService // Inyectar el servicio de regiones
  ) {
    this.createClientForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      region: ['', Validators.required],
      continent: [{ value: '', disabled: true }, Validators.required],
      country: [{ value: '', disabled: true }, Validators.required],
      firstName: ['', Validators.required],
      middleName: [''], // Optional
      lastName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Obtener las regiones del servicio
    this.distributorService.getRegions().subscribe((regions: Region[]) => {
      this.regions = regions;
    });
  }

  onRegionSelected(region: string): void {
    const selectedRegion = this.regions.find(r => r.region === region);
    
    if (selectedRegion) {
      // Actualizar los campos de país y continente en el formulario
      this.createClientForm.patchValue({
        country: selectedRegion.country,
        continent: selectedRegion.continent,
      });
    }
  }

  showErrorDialog(errorMessage: string): void {
    this.dialog.open(ErrorMessageComponent, {
      width: '400px',
      data: { message: errorMessage }
    });
  }

  onSave(): void {
    if (this.createClientForm.valid) {

      // Habilitar temporalmente los campos deshabilitados para recoger sus valores
      this.createClientForm.get('continent')?.enable();
      this.createClientForm.get('country')?.enable();

      const firstName = this.createClientForm.value.firstName;
      const middleName = this.createClientForm.value.middleName || ''; // Si no hay segundo nombre, se deja vacio
      const lastName = this.createClientForm.value.lastName;
      const fullName = `${firstName} ${middleName} ${lastName}`; // Usamos trim() para eliminar espacios extra si no hay segundo nombre
  
      const newClient: Client = {
        email: this.createClientForm.value.email,
        password: this.createClientForm.value.password,
        region: this.createClientForm.value.region,
        continent: this.createClientForm.value.continent,
        country: this.createClientForm.value.country,
        fullName: fullName,
        firstName: firstName,
        middleName: middleName,
        lastName: lastName
      };
      
      //verificar si el email esta en uso
      if(!this.clientService.isEmailInUse(newClient)){
        this.showErrorDialog('El correo electrónico ya está en uso. Por favor, ingresar otro Email.');
        return;
      }

      if(!this.clientService.isEmailValid(newClient.email)){
        this.showErrorDialog('El correo electrónico no es valido. Por favor, ingresar otro Email.');
        return;
      }
      this.dialogRef.close(newClient); // Cierra el diálogo y pasa el nuevo cliente al componente padre
    }
  }

  onCancel(): void {
    this.dialogRef.close(); // Cierra el diálogo sin realizar ninguna acción
  }
}
