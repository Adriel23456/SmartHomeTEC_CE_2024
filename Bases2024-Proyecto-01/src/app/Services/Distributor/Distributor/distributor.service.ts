import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { ApiService } from '../../Comunication/api-service.service';

export interface Distributor {
  legalNum: number;
  name: string;
  region: string;
  continent: string;
  country: string;
}

export interface Region {
  region: string;
  country: string;
  continent: string;
}

@Injectable({
  providedIn: 'root',
})
export class DistributorService {
  constructor(private apiService: ApiService) {}

  /**
   * Obtener todos los distribuidores desde la API.
   * @returns Observable con la lista de distribuidores.
   */
  getDistributors(): Observable<Distributor[]> {
    return this.apiService.getDistributors().pipe(
      tap(distributors => console.log('Distributors fetched:', distributors)),
      catchError(error => this.handleError('getDistributors', error))
    );
  }

  /**
   * Agrega un nuevo distribuidor utilizando la API.
   * @param distributor Distribuidor a agregar.
   * @returns Observable con el distribuidor agregado.
   */
  addDistributor(distributor: Distributor): Observable<Distributor> {
    console.log('Distribuidor a agregar:', distributor);
    return this.apiService.createDistributor(distributor).pipe(
      tap(newDistributor => console.log('Distribuidor agregado:', newDistributor)),
      catchError(error => this.handleError('addDistributor', error))
    );
  }

  /**
   * Actualiza un distribuidor existente utilizando la API.
   * @param originalDistributor Distribuidor original que se va a actualizar.
   * @param updatedDistributor Distribuidor con la información actualizada.
   * @returns Observable con el distribuidor actualizado.
   */
  updateDistributor(originalDistributor: Distributor, updatedDistributor: Distributor): Observable<Distributor> {
    console.log('Distribuidor a actualizar:', originalDistributor);
    console.log('Información nueva:', updatedDistributor);
    return this.apiService.updateDistributor(originalDistributor.legalNum, updatedDistributor).pipe(
      tap(updated => console.log('Distribuidor actualizado:', updated)),
      catchError(error => this.handleError('updateDistributor', error))
    );
  }

  /**
   * Verifica si el número legal de un distribuidor ya está en uso.
   * @param distributor Distribuidor a verificar.
   * @returns Observable<boolean> indicando si el número legal está en uso.
   */
  isLegalNumInUse(distributor: Distributor): Observable<boolean> {
    console.log('LegalNum a consultar:', distributor.legalNum);
    return this.apiService.getDistributorByLegalNum(distributor.legalNum).pipe(
      map(existingDistributor => !!existingDistributor), // Retorna true si existe, false si no
      tap(isInUse => console.log(`LegalNum ${distributor.legalNum} en uso:`, isInUse)),
      catchError(error => {
        if (error.status === 404) {
          // Si el distribuidor no existe, el número legal no está en uso
          return of(false);
        } else {
          return this.handleError('isLegalNumInUse', error);
        }
      })
    );
  }

  /**
   * Obtiene el nombre de un distribuidor dado su número legal.
   * @param legalNum Número legal del distribuidor.
   * @returns Observable<string> con el nombre del distribuidor o 'Desconocido' si no se encuentra.
   */
  getDistributorNameById(legalNum: number): Observable<string> {
    return this.apiService.getDistributorByLegalNum(legalNum).pipe(
      map(distributor => distributor ? distributor.name : 'Desconocido'),
      tap(deviceName => console.log(`Nombre del distribuidor con LegalNum ${legalNum}:`, deviceName)),
      catchError(error => {
        if (error.status === 404) {
          // Si el distribuidor no existe, retorna 'Desconocido'
          return of('Desconocido');
        } else {
          return this.handleError('getDistributorNameById', error);
        }
      })
    );
  }


  /**
   * Obtener todas las regiones de los distribuidores.
   * @returns Observable con la lista de regiones.
   */
  getRegions(): Observable<Region[]> {
    const operation = 'GET Regions';
    return this.getDistributors().pipe(
      // Mapear cada distribuidor a su objeto Region
      map((distributors: Distributor[]) => 
        distributors.map(distributor => ({
          region: distributor.region,
          country: distributor.country,
          continent: distributor.continent
        }))
      ),
      tap(regions => this.log(operation, regions)),
      catchError(error => this.handleError(operation, error))
    );
  }

  deleteDistributor(distributor: Distributor): Observable<void> {
    console.log('Distribuidor a eliminar:', distributor);
    return this.apiService.deleteDistributor(distributor.legalNum).pipe(
      tap(() => console.log('Distribuidor eliminado:', distributor.legalNum)),
      catchError(error => this.handleError('deleteDistributor', error))
    );
  }
  

  /**
   * Maneja los errores de las solicitudes HTTP.
   * @param operation Nombre de la operación que falló.
   * @param error Error ocurrido.
   * @returns Observable con el error.
   */
  private handleError(operation: string, error: any): Observable<never> {
    console.error(`${operation} falló: ${error.message}`);
    return throwError(() => new Error(`${operation} falló: ${error.message}`));
  }

  /**
   * Registra la operación y los datos asociados.
   * @param operation Nombre de la operación.
   * @param data Datos a registrar.
   */
  private log(operation: string, data: any): void {
    console.log(`${operation} - Datos:`, data);
  }
}