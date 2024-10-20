// distributor-management.component.ts
import { Component, OnInit } from '@angular/core';
import { Distributor, DistributorService } from '../../../Services/Distributor/Distributor/distributor.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateDistributorComponent } from './create-distributor/create-distributor.component';
import { EditDistributorComponent } from './edit-distributor/edit-distributor.component';
import { CommonModule } from '@angular/common';
import { DeleteDialogComponent } from '../../delete-dialog/delete-dialog.component';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-distributor-management',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    CommonModule,
    MatToolbarModule, 
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './distributor-management.component.html',
  styleUrls: ['./distributor-management.component.css']
})
export class DistributorManagementComponent implements OnInit {
  distributors: Distributor[] = [];

  constructor( // Constructor for the component
    private distributorService: DistributorService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void { // Lifecycle method that runs on initialization
    // Fetch the list of distributors from the service
    this.distributorService.getDistributors().subscribe(data => {
      this.distributors = data;
    });
  }

  addDistributor(): void { // Open the CreateDistributorComponent dialog
    const dialogRef = this.dialog.open(CreateDistributorComponent, {
      width: '600px'
    });

    // Subscribe to the dialog close event
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.distributorService.addDistributor(result).pipe(
          tap((newDistributor: Distributor) => {
            console.log('Distribuidor agregado exitosamente:', newDistributor);
            this.refreshDistributors(); // Actualizar la lista de distribuidores
          }),
          catchError((error) => {
            console.error('Error al agregar el distribuidor:', error);
            return of(null);
          })
        ).subscribe(); // Subscribe to execute the observable
      }
    });
  }

  /**
   * Opens the dialog to edit an existing distributor and handles the update operation.
   * @param distributor Distributor to edit.
   */
  editDistributor(distributor: Distributor): void {
    const originalDistributor = { ...distributor };

    const dialogRef = this.dialog.open(EditDistributorComponent, {
      width: '600px',
      data: { distributor }
    });

    // Subscribe to the dialog close event
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.distributorService.updateDistributor(originalDistributor, result).pipe(
          tap((updatedDistributor: Distributor) => {
            console.log('Distribuidor actualizado exitosamente:', updatedDistributor);
            this.refreshDistributors();
          }),
          catchError((error) => {
            console.error('Error al actualizar el distribuidor:', error);
            return of(null);
          })
        ).subscribe();
      }
    });
  }

  /**
   * Opens the delete confirmation dialog for a distributor.
   * @param distributor Distributor to delete.
   */
  onDelete(distributor: Distributor): void {
    // Open the DeleteDialogComponent with a confirmation message
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data: { message: `¿Seguro que quieres borrar el distribuidor: ${distributor.name} - ${distributor.legalNum}?` }
    });

    // Subscribe to the dialog close event
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.distributorService.deleteDistributor(distributor).pipe(
          tap(() => {
            console.log('Distribuidor eliminado exitosamente:', distributor);
            this.refreshDistributors();
          }),
          catchError((error) => {
            console.error('Error al eliminar el distribuidor:', error);
            return of(null);
          })
        ).subscribe();
      } else {
        console.log('Acción de borrar cancelada');
      }
    });
  }
  
  // Function to refresh the list of distributors
  refreshDistributors() {
    this.distributorService.getDistributors().subscribe(data => {
      this.distributors = data;
    });
  }
}
