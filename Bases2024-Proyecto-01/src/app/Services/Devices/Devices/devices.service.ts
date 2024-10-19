import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { ApiService } from '../../Comunication/api-service.service';
import { AssignedDevice } from '../../AssignedDevice/assigned-device.service';
import { Distributor, DistributorService } from '../../Distributor/Distributor/distributor.service';

export interface Device {
  serialNumber: number;
  price: number;
  state: string;
  brand: string;
  amountAvailable: number;
  electricalConsumption: number;
  name: string;
  description: string;
  deviceTypeName: string;
  legalNum: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  constructor(private apiService: ApiService, private distributorService: DistributorService) { }

  /**
   * Obtiene todos los dispositivos desde la API
   * @returns Observable con la lista de dispositivos
   */
  getDevices(): Observable<Device[]> {
    return this.apiService.getDevices().pipe(
      tap(devices => console.log('Devices fetched:', devices)),
      catchError(error => this.handleError('getDevices', error))
    );
  }

  /**
   * Obtiene los dispositivos asignados con estado "Local" desde la API
   * @returns Observable con la lista de dispositivos asignados
   */
  getAssignedDevices(): Observable<Device[]> {
    return this.apiService.getDevices().pipe(
      map(devices => devices.filter(device => device.state === 'Local')),
      tap(assignedDevices => console.log('Assigned Devices:', assignedDevices)),
      catchError(error => this.handleError('getAssignedDevices', error))
    );
  }

  /**
   * Calcula el promedio de dispositivos por usuario basado en AssignedDevices con estado "Present"
   * @returns Observable con el promedio de dispositivos por usuario
   */
  getAvgDevicesPerUser(): Observable<number> {
    return this.apiService.getAssignedDevices().pipe(
      // Primero obtenemos todos los AssignedDevices
      switchMap((assignedDevices: AssignedDevice[]) => {
        // Filtrar dispositivos con state = "Present"
        const presentDevices = assignedDevices.filter(device => device.state === 'Present');

        // Crear un mapa para contar dispositivos por usuario
        const deviceCountsByUser: { [email: string]: number } = {};
        presentDevices.forEach(device => {
          if (device.clientEmail) {
            deviceCountsByUser[device.clientEmail] = (deviceCountsByUser[device.clientEmail] || 0) + 1;
          }
        });

        const totalDevices = presentDevices.length;
        const uniqueUsers = Object.keys(deviceCountsByUser).length;

        // Calcular el promedio
        const average = uniqueUsers > 0 ? totalDevices / uniqueUsers : 0;
        return of(average);
      }),
      tap(avg => console.log('Promedio de dispositivos por usuario:', avg)),
      catchError(error => this.handleError('getAvgDevicesPerUser', error))
    );
  }

  /**
   * Actualiza un dispositivo existente utilizando la API.
   * @param originalDevice Dispositivo original que se va a actualizar
   * @param updatedDevice Dispositivo con la información actualizada
   * @returns Observable con el dispositivo actualizado
   */
  updateDevice(originalDevice: Device, updatedDevice: Device): Observable<Device> {
    console.log('Dispositivo a actualizar:', originalDevice);
    console.log('Información nueva:', updatedDevice);
    return this.apiService.updateDevice(originalDevice.serialNumber, updatedDevice).pipe(
      tap(updated => console.log('Dispositivo actualizado:', updated)),
      catchError(error => this.handleError('updateDevice', error))
    );
  }

  /**
   * Verifica si el número de serie de un dispositivo ya está en uso.
   * @param device Dispositivo a verificar
   * @returns Observable<boolean> indicando si el número de serie está en uso
   */
  isSerialNumberInUse(device: Device): Observable<boolean> {
    console.log("Número de serie a consultar:", device.serialNumber);
    return this.apiService.getDeviceBySerialNumber(device.serialNumber).pipe(
      map(existingDevice => !!existingDevice), // Retorna true si existe, false si no
      tap(isInUse => console.log(`Número de serie ${device.serialNumber} en uso:`, isInUse)),
      catchError(error => {
        if (error.status === 404) {
          // Si el dispositivo no existe, el número de serie no está en uso
          return of(false);
        } else {
          return this.handleError('isSerialNumberInUse', error);
        }
      })
    );
  }

  /**
   * Agrega un nuevo dispositivo utilizando la API.
   * @param device Dispositivo a agregar
   * @returns Observable con el dispositivo agregado
   */
  addDevice(device: Device): Observable<Device> {
    console.log('Dispositivo a agregar:', device);
    return this.apiService.createDevice(device).pipe(
      tap(newDevice => console.log('Dispositivo agregado:', newDevice)),
      catchError(error => this.handleError('addDevice', error))
    );
  }

  /**
   * Obtiene el nombre de un dispositivo dado su número de serie.
   * @param serialNumber Número de serie del dispositivo
   * @returns Observable<string> con el nombre del dispositivo o 'Desconocido' si no se encuentra
   */
  getDeviceNameBySerial(serialNumber: number): Observable<string> {
    return this.apiService.getDeviceBySerialNumber(serialNumber).pipe(
      map(device => device ? device.name : 'Desconocido'),
      tap(deviceName => console.log(`Nombre del dispositivo con serial ${serialNumber}:`, deviceName)),
      catchError(error => {
        if (error.status === 404) {
          // Si el dispositivo no existe, retorna 'Desconocido'
          return of('Desconocido');
        } else {
          return this.handleError('getDeviceNameBySerial', error);
        }
      })
    );
  }

  /**
   * Obtiene el conteo de dispositivos por región basado en el nombre del distribuidor.
   * @param distributorName Nombre del distribuidor.
   * @returns Observable<number> con el conteo de dispositivos.
   */
  getDeviceCountByRegion(distributorName: string): Observable<number> {
    return this.distributorService.getDistributors().pipe(
      // Encontrar el distribuidor por nombre
      map((distributors: Distributor[]) => distributors.find(d => d.region === distributorName)),
      tap(distributor => {
        if (distributor) {
          console.log('Distribuidor encontrado:', distributor);
        } else {
          console.log(`Distribuidor con nombre "${distributorName}" no encontrado.`);
        }
      }),
      // Si el distribuidor existe, obtener los dispositivos y contar los que coinciden
      switchMap((distributor: Distributor | undefined) => {
        if (!distributor) {
          // Si no se encuentra el distribuidor, retornar 0
          return of(0);
        }
        return this.apiService.getDevices().pipe(
          map((devices: Device[]) => devices.filter(device => device.legalNum === distributor.legalNum).length),
          tap(count => console.log(`Número de dispositivos para la región "${distributor.region}":`, count))
        );
      }),
      catchError(error => this.handleError('getDeviceCountByRegion', error))
    );
  }

  /**
   * Elimina un dispositivo utilizando la API.
   * @param device Dispositivo a eliminar
   * @returns Observable<void>
   */
  deleteDevice(device: Device): Observable<void> {
    console.log('Dispositivo a eliminar:', device);
    return this.apiService.deleteDevice(device.serialNumber).pipe(
      tap(() => {
        console.log(`Dispositivo con serialNumber ${device.serialNumber} eliminado.`);
      }),
      catchError(error => this.handleError('deleteDevice', error))
    );
  }

  /**
   * Obtiene un dispositivo por su número de serie utilizando la API.
   * @param serialNumber Número de serie del dispositivo
   * @returns Observable con el dispositivo
   */
  getDeviceBySerialNumber(serialNumber: number): Observable<Device> {
    console.log('Obteniendo dispositivo con serialNumber:', serialNumber);
    return this.apiService.getDeviceBySerialNumber(serialNumber).pipe(
      tap(device => console.log('Dispositivo obtenido:', device)),
      catchError(error => this.handleError('getDeviceBySerialNumber', error))
    );
  }

  /**
   * Actualiza el estado de un dispositivo dado su número de serie.
   * @param serialNumber Número de serie del dispositivo
   * @param newState Nuevo estado del dispositivo
   * @returns Observable con el dispositivo actualizado
   */
  updateStateBySerialNumber(serialNumber: number, newState: string): Observable<Device> {
    console.log(`Actualizando estado del dispositivo con serialNumber ${serialNumber} a '${newState}'`);
    return this.getDeviceBySerialNumber(serialNumber).pipe(
      switchMap(device => {
        if (!device) {
          return throwError(() => new Error(`Dispositivo con serialNumber ${serialNumber} no encontrado`));
        }
        const updatedDevice = { ...device, state: newState };
        return this.apiService.updateDevice(serialNumber, updatedDevice);
      }),
      tap(updated => console.log('Estado del dispositivo actualizado:', updated)),
      catchError(error => this.handleError('updateStateBySerialNumber', error))
    );
  }

  /**
   * Obtiene el consumo eléctrico de un dispositivo dado su número de serie.
   * @param serialNumber Número de serie del dispositivo
   * @returns Observable<number> con el consumo eléctrico o 0 si no se encuentra
   */
  getElectricalConsumptionBySerialNumber(serialNumber: number): Observable<number> {
    return this.apiService.getDeviceBySerialNumber(serialNumber).pipe(
      map(device => device ? device.electricalConsumption : 0),
      tap(electricalConsumption => console.log(`Consumo eléctrico del dispositivo con serial ${serialNumber}:`, electricalConsumption)),
      catchError(error => {
        if (error.status === 404) {
          return of(0);
        } else {
          return this.handleError('getElectricalConsumptionBySerialNumber', error);
        }
      })
    );
  }


  /**
   * Maneja los errores de las solicitudes HTTP
   * @param operation Nombre de la operación que falló
   * @param error Error ocurrido
   * @returns Observable con el error
   */
  private handleError(operation: string, error: any): Observable<never> {
    console.error(`${operation} falló: ${error.message}`);
    return throwError(() => new Error(`${operation} falló: ${error.message}`));
  }
}
