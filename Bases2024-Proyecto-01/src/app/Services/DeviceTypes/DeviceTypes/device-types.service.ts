import { Injectable } from '@angular/core';
import { Observable, of, map, tap, catchError, throwError } from 'rxjs';
import { ApiService } from '../../Comunication/api-service.service';

export interface DeviceType {
  name: string;
  description: string;
  warrantyDays: number;
}

@Injectable({
  providedIn: 'root'
})
export class DeviceTypesService {

  constructor(private apiService: ApiService) { }

  /**
   * Obtener todos los tipos de dispositivo desde la API.
   * @returns Observable con la lista de tipos de dispositivo.
   */
  getDeviceTypes(): Observable<DeviceType[]> {
    return this.apiService.getDeviceTypes().pipe(
      tap(deviceTypes => console.log('DeviceTypes fetched:', deviceTypes)),
      catchError(error => this.handleError('getDeviceTypes', error))
    );
  }

  /**
   * Agrega un nuevo tipo de dispositivo utilizando la API.
   * @param deviceType Tipo de dispositivo a agregar.
   * @returns Observable con el tipo de dispositivo agregado.
   */
  addDeviceType(deviceType: DeviceType): Observable<DeviceType> {
    console.log('DeviceType a agregar:', deviceType);
    return this.apiService.createDeviceType(deviceType).pipe(
      tap(newDeviceType => console.log('DeviceType agregado:', newDeviceType)),
      catchError(error => this.handleError('addDeviceType', error))
    );
  }

  /**
   * Actualiza un tipo de dispositivo existente utilizando la API.
   * @param originalType Tipo de dispositivo original que se va a actualizar.
   * @param updatedType Tipo de dispositivo con la información actualizada.
   * @returns Observable con el tipo de dispositivo actualizado.
   */
  updateDeviceType(originalType: DeviceType, updatedType: DeviceType): Observable<DeviceType> {
    console.log('DeviceType a actualizar:', originalType);
    console.log('Información nueva:', updatedType);

    return this.apiService.updateDeviceType(originalType.name, updatedType).pipe(
      tap(updated => console.log('DeviceType actualizado:', updated)),
      catchError(error => this.handleError('updateDeviceType', error))
    );
  }

  /**
   * Verifica si el nombre de un tipo de dispositivo ya está en uso.
   * @param deviceType Tipo de dispositivo a verificar.
   * @returns Observable<boolean> indicando si el nombre está en uso.
   */
  isTypeNameInUse(deviceType: DeviceType): Observable<boolean> {
    console.log('Nombre a consultar:', deviceType.name);

    return this.apiService.getDeviceTypeByName(deviceType.name).pipe(
      map(existingDeviceType => !!existingDeviceType), // Retorna true si existe, false si no
      tap(isInUse => console.log(`Nombre ${deviceType.name} en uso:`, isInUse)),
      catchError(error => {
        if (error.status === 404) {
          // Si el tipo de dispositivo no existe, el nombre no está en uso
          return of(false);
        } else {
          return this.handleError('isTypeNameInUse', error);
        }
      })
    );
  }

  deleteDeviceType(deviceType: DeviceType): Observable<void> {
    console.log('DeviceType a eliminar:', deviceType);
    return this.apiService.deleteDeviceType(deviceType.name).pipe(
      tap(() => console.log('DeviceType eliminado:', deviceType.name)),
      catchError(error => this.handleError('deleteDeviceType', error))
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
}
