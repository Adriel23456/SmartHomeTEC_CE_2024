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
  editUserForm: FormGroup;// Form group for user editing form
  regions: Region[] = [];  // Array to store regions fetched from DistributorService

  constructor(
    private clientService: ClientService,// Service for client-related logic
    private distributorService: DistributorService,// Service for fetching region-related data
    private dialog: MatDialog,// Dialog service for displaying error dialogs
    private dialogRef: MatDialogRef<EditUserComponent>,// Reference to the dialog instance
    @Inject(MAT_DIALOG_DATA) public data: { client: Client },// Data passed into the dialog, containing the client to edit
    private fb: FormBuilder// FormBuilder for constructing the form
  ) { // Initializing the form with client data
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
// Fetch regions from the DistributorService on initialization
  ngOnInit(): void {
    this.distributorService.getRegions().subscribe((regions: Region[]) => {
      this.regions = regions;
    });
  }
  // Handles region selection, updates the country and continent fields based on the selected region
  onRegionSelected(region: string): void {
    const selectedRegion = this.regions.find(r => r.region === region);
    // Update form fields for country and continent based on the selected region
    if (selectedRegion) {
      this.editUserForm.patchValue({
        country: selectedRegion.country,
        continent: selectedRegion.continent,
      });
    }
  }
   // Opens an error dialog when needed
  showErrorDialog(errorMessage: string): void {
    this.dialog.open(ErrorMessageComponent, {
      width: '400px',
      data: { message: errorMessage }
    });
  }

  onSave(): void {
    if (this.editUserForm.valid) {

      // Handles form submission when saving the edited user
      this.editUserForm.get('continent')?.enable();
      this.editUserForm.get('country')?.enable();
      this.editUserForm.get('email')?.enable();
       // Prepare full name from form values
      const firstName = this.editUserForm.value.firstName;
      const middleName = this.editUserForm.value.middleName || '';// Empty if middle name not provided
      const lastName = this.editUserForm.value.lastName;
      const fullName = `${firstName} ${middleName} ${lastName}`; 
  // Construct new client object with updated values
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
// Validate email format before proceeding
      if(!this.clientService.isEmailValid(newClient.email)){
        this.showErrorDialog('El correo electrónico no es valido. Por favor, ingresar otro Email.');
        return;
      }// Close the dialog and pass the updated client object to the parent component
      this.dialogRef.close(newClient); 
    }
  }

  onCancel(): void {
    this.dialogRef.close(); 
  }
}