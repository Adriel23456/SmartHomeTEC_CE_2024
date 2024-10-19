import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { ApiService } from '../../Comunication/api-service.service';

export interface Client {
  email: string;
  password: string;
  region: string;
  continent: string;
  country: string;
  fullName: string;
  firstName: string;
  middleName: string;
  lastName: string;
}

export interface Admin {
  email: string;
  password: string;
}

const commonDomains: string[] = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'live.com',
  'icloud.com',
  'smartHomeAdmin.com',
];

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  constructor(private apiService: ApiService) { }
  
  /**
   * Obtiene la lista de clientes desde la API
   * @returns Observable con la lista de clientes
   */
  getClients(): Observable<Client[]> {
    return this.apiService.getClients().pipe(
      tap(clients => console.log('Clientes obtenidos:', clients)),
      catchError(error => this.handleError('getClients', error))
    );
  }

  /**
   * Obtiene el total de clientes desde la API
   * @returns Observable con el número total de clientes
   */
  getTotalClients(): Observable<number> {
    return this.apiService.getClients().pipe(
      map(clients => clients.length), // Contamos cuántos clientes hay en la respuesta
      tap(count => console.log('Total de clientes:', count)),
      catchError(error => this.handleError('getTotalClients', error))
    );
  }

  /**
   * Verifica si el email de un cliente ya está en uso
   * @param client Cliente a consultar
   * @returns Booleano indicando si el email está en uso
   */
  isEmailInUse(client: Client): Observable<boolean> {
    return this.apiService.getClientByEmail(client.email).pipe(
      map(existingClient => !!existingClient), // Devuelve true si el cliente existe
      tap(isInUse => console.log(`Email ${client.email} en uso:`, isInUse)),
      catchError(error => {
        if (error.status === 404) {
          // Si el error es 404, significa que el cliente no existe, así que el email no está en uso
          return [false];
        } else {
          return this.handleError('isEmailInUse', error);
        }
      })
    );
  }

  /**
   * Agrega un nuevo cliente utilizando la API.
   * @param newClient Cliente a agregar
   * @returns Observable con el cliente agregado
   */
  addClient(newClient: Client): Observable<Client> {
    return this.apiService.createClient(newClient).pipe(
      tap(client => console.log('Cliente agregado:', client)),
      catchError(error => this.handleError('addClient', error))
    );
  }

  /**
   * Actualiza un cliente existente utilizando la API.
   * @param outdatedClient Cliente a actualizar (versión desactualizada)
   * @param updatedClient Cliente con los datos actualizados
   * @returns Observable con el cliente actualizado
   */
  updateClient(outdatedClient: Client, updatedClient: Client): Observable<Client> {
    return this.apiService.updateClient(outdatedClient.email, updatedClient).pipe(
      tap(client => console.log('Cliente actualizado:', client)),
      catchError(error => this.handleError('updateClient', error))
    );
  }

  isEmailValid(email: string): boolean {
    // Dividir el email por "@" y eliminar espacios
    const parts = email.trim().split('@');
  
    // Verificar que haya exactamente 2 partes
    if (parts.length !== 2) {
      return false; // No es un email válido
    }
  
    const domain = parts[1]; // Obtener el dominio
  
    // Comprobar si el dominio está en el array de dominios comunes
    return commonDomains.includes(domain);
  }
  
  /**
   * Busca un cliente según el número serial del dispositivo que tiene asignado
   * @param serialNumber Número serial del dispositivo
   * @returns Observable con el email del cliente o 'No asignado' si no se encuentra
   */
  getClientEmailBySerial(serialNumber: number): Observable<string> {
    return this.apiService.getAssignedDevices().pipe(
      map(assignedDevices => {
        const assignedDevice = assignedDevices.find(device => device.serialNumberDevice === serialNumber);
        return assignedDevice ? assignedDevice.clientEmail : 'No asignado';
      }),
      tap(clientEmail => console.log(`Cliente con serial ${serialNumber}:`, clientEmail)),
      catchError(error => this.handleError('getClientEmailBySerial', error))
    );
  }

  /**
   * Manejo de errores
   * @param operation Nombre de la operación
   * @param error El error recibido
   * @returns Observable con el error
   */
  private handleError(operation: string, error: any): Observable<never> {
    console.error(`${operation} falló: ${error.message}`);
    return throwError(() => new Error(`${operation} falló: ${error.message}`));
  }
}
