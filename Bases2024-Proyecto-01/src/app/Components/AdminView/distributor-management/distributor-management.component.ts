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

  constructor(
    private distributorService: DistributorService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.distributorService.getDistributors().subscribe(data => {
      this.distributors = data;
    });
  }

  /**
   * Abre el diálogo para agregar un nuevo distribuidor y maneja la operación de agregado.
   */
  addDistributor(): void {
    const dialogRef = this.dialog.open(CreateDistributorComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.distributorService.addDistributor(result).pipe(
          tap((newDistributor: Distributor) => {
            // Manejar el éxito, por ejemplo, mostrar una notificación
            console.log('Distribuidor agregado exitosamente:', newDistributor);
            this.refreshDistributors(); // Actualizar la lista de distribuidores
          }),
          catchError((error) => {
            // Manejar el error, por ejemplo, mostrar una notificación de error
            console.error('Error al agregar el distribuidor:', error);
            // Retornar un observable vacío para completar la cadena
            return of(null);
          })
        ).subscribe();
      }
    });
  }

  /**
   * Abre el diálogo para editar un distribuidor existente y maneja la operación de actualización.
   * @param distributor Distribuidor a editar.
   */
  editDistributor(distributor: Distributor): void {
    const originalDistributor = { ...distributor }; // Copia del distribuidor original

    const dialogRef = this.dialog.open(EditDistributorComponent, {
      width: '600px',
      data: { distributor }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.distributorService.updateDistributor(originalDistributor, result).pipe(
          tap((updatedDistributor: Distributor) => {
            // Manejar el éxito, por ejemplo, mostrar una notificación
            console.log('Distribuidor actualizado exitosamente:', updatedDistributor);
            this.refreshDistributors(); // Actualizar la lista de distribuidores
          }),
          catchError((error) => {
            // Manejar el error, por ejemplo, mostrar una notificación de error
            console.error('Error al actualizar el distribuidor:', error);
            // Retornar un observable vacío para completar la cadena
            return of(null);
          })
        ).subscribe();
      }
    });
  }

  onDelete(distributor: Distributor): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data: { message: `¿Seguro que quieres borrar el distribuidor: ${distributor.name} - ${distributor.legalNum}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.distributorService.deleteDistributor(distributor).pipe(
          tap(() => {
            // Manejar el éxito, por ejemplo, mostrar una notificación
            console.log('Distribuidor eliminado exitosamente:', distributor);
            this.refreshDistributors(); // Actualizar la lista de distribuidores
          }),
          catchError((error) => {
            // Manejar el error, por ejemplo, mostrar una notificación de error
            console.error('Error al eliminar el distribuidor:', error);
            // Retornar un observable vacío para completar la cadena sin propagar el error
            return of(null);
          })
        ).subscribe();
      } else {
        // El usuario canceló la acción de borrar
        console.log('Acción de borrar cancelada');
      }
    });
  }
  
  // Función para refrescar la lista de distribuidores
  refreshDistributors() {
    this.distributorService.getDistributors().subscribe(data => {
      this.distributors = data;
    });
  }
}
