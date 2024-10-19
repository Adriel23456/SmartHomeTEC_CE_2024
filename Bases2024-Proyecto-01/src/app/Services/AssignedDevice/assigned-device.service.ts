import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ApiService } from '../Comunication/api-service.service';

export interface AssignedDevice {
  assignedID: number;
  serialNumberDevice: number;
  clientEmail: string;
  state: string;
}

@Injectable({
  providedIn: 'root'
})
export class AssignedDeviceService {

  constructor(private apiService: ApiService) { }

  /**
   * Obtener todos los dispositivos asignados desde la API.
   * @returns Observable con la lista de dispositivos asignados.
   */
  getAssignedDevices(): Observable<AssignedDevice[]> {
    const operation = 'GET AssignedDevices';
    return this.apiService.getAssignedDevices().pipe(
      tap(assignedDevices => this.log(operation, assignedDevices)),
      catchError(error => this.handleError(operation, error))
    );
  }

  /**
   * Obtener un dispositivo asignado por su ID.
   * @param assignedID ID del dispositivo asignado.
   * @returns Observable con el dispositivo asignado.
   */
  getAssignedDeviceById(assignedID: number): Observable<AssignedDevice> {
    const operation = `GET AssignedDevice By ID: ${assignedID}`;
    return this.apiService.getAssignedDeviceById(assignedID).pipe(
      tap(assignedDevice => this.log(operation, assignedDevice)),
      catchError(error => this.handleError(operation, error))
    );
  }

  /**
   * Crear un nuevo dispositivo asignado.
   * @param assignedDevice Datos del dispositivo asignado a crear.
   * @returns Observable con el dispositivo asignado creado.
   */
  createAssignedDevice(assignedDevice: AssignedDevice): Observable<AssignedDevice> {
    const operation = 'POST Create AssignedDevice';
    return this.apiService.createAssignedDevice(assignedDevice).pipe(
      tap(newAssignedDevice => this.log(operation, newAssignedDevice)),
      catchError(error => this.handleError(operation, error))
    );
  }

  /**
   * Actualizar un dispositivo asignado por su ID.
   * @param assignedID ID del dispositivo asignado a actualizar.
   * @param updatedDevice Datos actualizados del dispositivo asignado.
   * @returns Observable con el dispositivo asignado actualizado.
   */
  updateAssignedDevice(assignedID: number, updatedDevice: Partial<AssignedDevice>): Observable<AssignedDevice> {
    const operation = `PUT Update AssignedDevice ID: ${assignedID}`;
    return this.apiService.updateAssignedDevice(assignedID, updatedDevice).pipe(
      tap(updatedAssignedDevice => this.log(operation, updatedAssignedDevice)),
      catchError(error => this.handleError(operation, error))
    );
  }

  /**
   * Registra la operación y los datos asociados.
   * @param operation Nombre de la operación.
   * @param data Datos a registrar.
   */
  private log(operation: string, data: any): void {
    console.log(`${operation} - Datos:`, data);
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
