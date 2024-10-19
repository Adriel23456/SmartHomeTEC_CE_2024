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
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent {
  editUserForm: FormGroup;
  regions: Region[] = []; // Arreglo para almacenar las regiones

  constructor(
    private clientService: ClientService,
    private distributorService: DistributorService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { client: Client },
    private fb: FormBuilder
  ) {
    this.editUserForm = this.fb.group({
      email: [{ value: this.data.client.email, disabled: true }, [Validators.required, Validators.email]],
      password: [this.data.client.password, [Validators.required, Validators.minLength(4)]],
      region: [this.data.client.region, Validators.required],
      continent: [{ value: this.data.client.continent, disabled: true }, [Validators.required]],
      country: [{ value: this.data.client.country, disabled: true }, [Validators.required]],
      firstName: [this.data.client.firstName, Validators.required],
      middleName: [this.data.client.middleName], // Optional
      lastName: [this.data.client.lastName, Validators.required]
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
      this.editUserForm.patchValue({
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
    if (this.editUserForm.valid) {

      // Habilitar temporalmente los campos deshabilitados para recoger sus valores
      this.editUserForm.get('continent')?.enable();
      this.editUserForm.get('country')?.enable();
      this.editUserForm.get('email')?.enable();

      const firstName = this.editUserForm.value.firstName;
      const middleName = this.editUserForm.value.middleName || ''; // Si no hay segundo nombre, se deja vacio
      const lastName = this.editUserForm.value.lastName;
      const fullName = `${firstName} ${middleName} ${lastName}`; // Usamos trim() para eliminar espacios extra si no hay segundo nombre
  
      const newClient: Client = {
        email: this.editUserForm.value.email,
        password: this.editUserForm.value.password,
        region: this.editUserForm.value.region,
        continent: this.editUserForm.value.continent,
        country: this.editUserForm.value.country,
        fullName: fullName,
        firstName: firstName,
        middleName: middleName,
        lastName: lastName
      };

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