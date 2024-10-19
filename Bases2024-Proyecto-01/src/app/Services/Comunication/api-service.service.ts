import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Client } from '../Clients/Clients/clients.service';
import { Device } from '../../Services/Devices/Devices/devices.service';
import { AssignedDevice } from '../AssignedDevice/assigned-device.service';
import { Distributor } from '../Distributor/Distributor/distributor.service';
import { DeviceType } from '../DeviceTypes/DeviceTypes/device-types.service';
import { Order } from '../Orders/Orders/orders.service';
import { UsageLog } from '../UsageLogs/UsageLogs/usage-logs.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  /**
   * Maneja los errores de las solicitudes HTTP.
   * @param operation Nombre de la operación que falló.
   * @returns Función que maneja el error.
   */
  private handleError(operation: string) {
    return (error: HttpErrorResponse): Observable<never> => {
      console.error(`${operation} falló: ${error.message}`);
      return throwError(() => new Error(`${operation} falló: ${error.message}`));
    };
  }

  private log(operation: string, data: any) {
    console.log(`${operation} - Datos:`, data);
  }

  // -----------------------------------
  // Métodos para Admin
  // -----------------------------------

  getAdmins(): Observable<any[]> {
    const operation = 'GET Admins';
    return this.http.get<any[]>(`${this.apiUrl}/Admin`).pipe(
      tap(admins => this.log(operation, admins)),
      catchError(this.handleError(operation))
    );
  }

  getAdminByEmail(email: string): Observable<any> {
    const operation = `GET Admin by Email: ${email}`;
    return this.http.get<any>(`${this.apiUrl}/Admin/${email}`).pipe(
      tap(admin => this.log(operation, admin)),
      catchError(this.handleError(operation))
    );
  }

  createAdmin(admin: any): Observable<any> {
    const operation = 'POST Create Admin';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/Admin`, admin, { headers }).pipe(
      tap(newAdmin => this.log(operation, newAdmin)),
      catchError(this.handleError(operation))
    );
  }

  updateAdmin(email: string, admin: Partial<any>): Observable<void> {
    const operation = `PUT Update Admin Email: ${email}`;
    return this.http.put<void>(`${this.apiUrl}/Admin/${email}`, admin).pipe(
      tap(() => this.log(operation, 'Actualización exitosa')),
      catchError(this.handleError(operation))
    );
  }

  loginAdmin(adminCredentials: any): Observable<any> {
    const operation = 'POST Admin Login';
    return this.http.post<any>(`${this.apiUrl}/Admin/Login`, adminCredentials).pipe(
      tap(response => this.log(operation, response)),
      catchError(this.handleError(operation))
    );
  }

  // -----------------------------------
  // Métodos para Client
  // -----------------------------------

  getClients(): Observable<any[]> {
    const operation = 'GET Clients';
    return this.http.get<any[]>(`${this.apiUrl}/Client`).pipe(
      tap(clients => this.log(operation, clients)),
      catchError(this.handleError(operation))
    );
  }

  getClientByEmail(email: string): Observable<any> {
    const operation = `GET Client by Email: ${email}`;
    return this.http.get<any>(`${this.apiUrl}/Client/${email}`).pipe(
      tap(client => this.log(operation, client)),
      catchError(this.handleError(operation))
    );
  }

  createClient(client: any): Observable<any> {
    const operation = 'POST Create Client';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/Client`, client, { headers }).pipe(
      tap(newClient => this.log(operation, newClient)),
      catchError(this.handleError(operation))
    );
  }

  // Método para actualizar un cliente existente y retornar el cliente actualizado
  updateClient(email: string, client: Partial<any>): Observable<Client> {
    const operation = `PUT Update Client Email: ${email}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    return this.http.put<Client>(`${this.apiUrl}/Client/${email}`, client, { headers }).pipe(
      tap(updatedClient => this.log(operation, updatedClient)),
      catchError(this.handleError(operation))
    );
  }


  loginClient(clientCredentials: any): Observable<any> {
    const operation = 'POST Client Login';
    return this.http.post<any>(`${this.apiUrl}/Client/Login`, clientCredentials).pipe(
      tap(response => this.log(operation, response)),
      catchError(this.handleError(operation))
    );
  }

  // -----------------------------------
  // Métodos para AssignedDevice
  // -----------------------------------

  /**
   * Obtener todos los dispositivos asignados
   * @returns Observable con la lista de dispositivos asignados
   */
  getAssignedDevices(): Observable<AssignedDevice[]> {
    const operation = 'GET AssignedDevices';
    return this.http.get<AssignedDevice[]>(`${this.apiUrl}/AssignedDevice`).pipe(
      tap(assignedDevices => this.log(operation, assignedDevices)),
      catchError(this.handleError(operation))
    );
  }

  /**
   * Obtener un dispositivo asignado por su ID
   * @param assignedID ID del dispositivo asignado
   * @returns Observable con el dispositivo asignado
   */
  getAssignedDeviceById(assignedID: number): Observable<AssignedDevice> {
    const operation = `GET AssignedDevice By ID: ${assignedID}`;
    return this.http.get<AssignedDevice>(`${this.apiUrl}/AssignedDevice/${assignedID}`).pipe(
      tap(assignedDevice => this.log(operation, assignedDevice)),
      catchError(this.handleError(operation))
    );
  }

  /**
   * Crear un nuevo dispositivo asignado
   * @param assignedDevice Datos del dispositivo asignado a crear
   * @returns Observable con el dispositivo asignado creado
   */
  createAssignedDevice(assignedDevice: AssignedDevice): Observable<AssignedDevice> {
    const operation = 'POST Create AssignedDevice';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<AssignedDevice>(`${this.apiUrl}/AssignedDevice`, assignedDevice, { headers }).pipe(
      tap(newAssignedDevice => this.log(operation, newAssignedDevice)),
      catchError(this.handleError(operation))
    );
  }

  /**
   * Actualizar un dispositivo asignado por su ID
   * @param assignedID ID del dispositivo asignado a actualizar
   * @param updatedDevice Datos actualizados del dispositivo asignado
   * @returns Observable con el dispositivo asignado actualizado
   */
  updateAssignedDevice(assignedID: number, updatedDevice: Partial<AssignedDevice>): Observable<AssignedDevice> {
    const operation = `PUT Update AssignedDevice ID: ${assignedID}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<AssignedDevice>(`${this.apiUrl}/AssignedDevice/${assignedID}`, updatedDevice, { headers }).pipe(
      tap(updatedAssignedDevice => this.log(operation, updatedAssignedDevice)),
      catchError(this.handleError(operation))
    );
  }

  // -----------------------------------
  // Métodos para Device
  // -----------------------------------

  /**
   * Obtener todos los dispositivos
   * @returns Observable con la lista de dispositivos
   */
  getDevices(): Observable<Device[]> {
    const operation = 'GET Devices';
    return this.http.get<Device[]>(`${this.apiUrl}/Device`).pipe(
      tap(devices => this.log(operation, devices)),
      catchError(this.handleError(operation))
    );
  }

  /**
   * Obtener un dispositivo por su número de serie
   * @param serialNumber Número de serie del dispositivo
   * @returns Observable con el dispositivo
   */
  getDeviceBySerialNumber(serialNumber: number): Observable<Device> {
    const operation = `GET Device by SerialNumber: ${serialNumber}`;
    return this.http.get<Device>(`${this.apiUrl}/Device/${serialNumber}`).pipe(
      tap(device => this.log(operation, device)),
      catchError(this.handleError(operation))
    );
  }

  /**
   * Crear un nuevo dispositivo
   * @param device Datos del nuevo dispositivo
   * @returns Observable con el dispositivo creado
   */
  createDevice(device: Device): Observable<Device> {
    const operation = 'POST Create Device';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Device>(`${this.apiUrl}/Device`, device, { headers }).pipe(
      tap(newDevice => this.log(operation, newDevice)),
      catchError(this.handleError(operation))
    );
  }

  /**
   * Actualizar un dispositivo existente por su número de serie
   * @param serialNumber Número de serie del dispositivo a actualizar
   * @param updatedDevice Datos actualizados del dispositivo
   * @returns Observable con el dispositivo actualizado
   */
  updateDevice(serialNumber: number, updatedDevice: Partial<Device>): Observable<Device> {
    const operation = `PUT Update Device by SerialNumber: ${serialNumber}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Device>(`${this.apiUrl}/Device/${serialNumber}`, updatedDevice, { headers }).pipe(
      tap(updated => this.log(operation, updated)),
      catchError(this.handleError(operation))
    );
  }

  /**
   * Eliminar un dispositivo por su número de serie
   * @param serialNumber Número de serie del dispositivo a eliminar
   * @returns Observable que indica el resultado de la operación
   */
  deleteDevice(serialNumber: number): Observable<void> {
    const operation = `DELETE Device SerialNumber: ${serialNumber}`;
    return this.http.delete<void>(`${this.apiUrl}/Device/${serialNumber}`).pipe(
      tap(() => this.log(operation, `Dispositivo con SerialNumber ${serialNumber} eliminado`)),
      catchError(this.handleError(operation))
    );
  }

  // -----------------------------------
  // Métodos para Distributor
  // -----------------------------------

  /**
   * Obtener todos los distribuidores
   * @returns Observable con la lista de distribuidores
   */
  getDistributors(): Observable<Distributor[]> {
    const operation = 'GET Distributors';
    return this.http.get<Distributor[]>(`${this.apiUrl}/Distributor`).pipe(
      tap(distributors => this.log(operation, distributors)),
      catchError(this.handleError(operation))
    );
  }

  /**
   * Obtener un distribuidor por su número legal
   * @param legalNum Número legal del distribuidor
   * @returns Observable con el distribuidor
   */
  getDistributorByLegalNum(legalNum: number): Observable<Distributor> {
    const operation = `GET Distributor by LegalNum: ${legalNum}`;
    return this.http.get<Distributor>(`${this.apiUrl}/Distributor/${legalNum}`).pipe(
      tap(distributor => this.log(operation, distributor)),
      catchError(this.handleError(operation))
    );
  }

  /**
   * Crear un nuevo distribuidor
   * @param distributor Datos del nuevo distribuidor
   * @returns Observable con el distribuidor creado
   */
  createDistributor(distributor: Distributor): Observable<Distributor> {
    const operation = 'POST Create Distributor';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Distributor>(`${this.apiUrl}/Distributor`, distributor, { headers }).pipe(
      tap(newDistributor => this.log(operation, newDistributor)),
      catchError(this.handleError(operation))
    );
  }

  /**
   * Actualizar un distribuidor existente por su número legal
   * @param legalNum Número legal del distribuidor a actualizar
   * @param updatedDistributor Datos actualizados del distribuidor
   * @returns Observable con el distribuidor actualizado
   */
  updateDistributor(legalNum: number, updatedDistributor: Partial<Distributor>): Observable<Distributor> {
    const operation = `PUT Update Distributor LegalNum: ${legalNum}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Distributor>(`${this.apiUrl}/Distributor/${legalNum}`, updatedDistributor, { headers }).pipe(
      tap(updated => this.log(operation, updated)),
      catchError(this.handleError(operation))
    );
  }

  /**
   * Eliminar un distribuidor por su número legal
   * @param legalNum Número legal del distribuidor a eliminar
   * @returns Observable que indica el resultado de la operación
   */
  deleteDistributor(legalNum: number): Observable<void> {
    const operation = `DELETE Distributor LegalNum: ${legalNum}`;
    return this.http.delete<void>(`${this.apiUrl}/Distributor/${legalNum}`).pipe(
      tap(() => this.log(operation, `Distribuidor con LegalNum ${legalNum} eliminado`)),
      catchError(this.handleError(operation))
    );
  }

  // -----------------------------------
  // Métodos para DeviceType
  // -----------------------------------
  
  /**
   * Obtener todos los tipos de dispositivo
   * @returns Observable con la lista de tipos de dispositivo
   */
  getDeviceTypes(): Observable<DeviceType[]> {
    const operation = 'GET DeviceTypes';
    return this.http.get<DeviceType[]>(`${this.apiUrl}/DeviceType`).pipe(
      tap(deviceTypes => this.log(operation, deviceTypes)),
      catchError(this.handleError(operation))
    );
  }

  /**
   * Obtener un tipo de dispositivo por su nombre
   * @param name Nombre del tipo de dispositivo
   * @returns Observable con el tipo de dispositivo
   */
  getDeviceTypeByName(name: string): Observable<DeviceType> {
    const operation = `GET DeviceType by Name: ${name}`;
    return this.http.get<DeviceType>(`${this.apiUrl}/DeviceType/${name}`).pipe(
      tap(deviceType => this.log(operation, deviceType)),
      catchError(this.handleError(operation))
    );
  }

  /**
   * Crear un nuevo tipo de dispositivo
   * @param deviceType Datos del nuevo tipo de dispositivo
   * @returns Observable con el tipo de dispositivo creado
   */
  createDeviceType(deviceType: DeviceType): Observable<DeviceType> {
    const operation = 'POST Create DeviceType';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<DeviceType>(`${this.apiUrl}/DeviceType`, deviceType, { headers }).pipe(
      tap(newDeviceType => this.log(operation, newDeviceType)),
      catchError(this.handleError(operation))
    );
  }

  /**
   * Actualizar un tipo de dispositivo existente por su nombre
   * @param name Nombre del tipo de dispositivo a actualizar
   * @param updatedDeviceType Datos actualizados del tipo de dispositivo
   * @returns Observable con el tipo de dispositivo actualizado
   */
  updateDeviceType(name: string, updatedDeviceType: Partial<DeviceType>): Observable<DeviceType> {
    const operation = `PUT Update DeviceType Name: ${name}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<DeviceType>(`${this.apiUrl}/DeviceType/${name}`, updatedDeviceType, { headers }).pipe(
      tap(updated => this.log(operation, updated)),
      catchError(this.handleError(operation))
    );
  }

  /**
   * Eliminar un tipo de dispositivo por su nombre
   * @param name Nombre del tipo de dispositivo a eliminar
   * @returns Observable<void>
   */
  deleteDeviceType(name: string): Observable<void> {
    const operation = `DELETE DeviceType Name: ${name}`;
    return this.http.delete<void>(`${this.apiUrl}/DeviceType/${name}`).pipe(
      tap(() => this.log(operation, `Tipo de dispositivo con nombre ${name} eliminado`)),
      catchError(this.handleError(operation))
    );
  }

  // -----------------------------------
  // Métodos para Order
  // -----------------------------------

  /**
   * Obtener todas las órdenes desde la API.
   * @returns Observable con la lista de órdenes.
   */
  getOrders(): Observable<Order[]> {
    const operation = 'GET Orders';
    return this.http.get<Order[]>(`${this.apiUrl}/Order`).pipe(
      tap(orders => this.log(operation, orders)),
      catchError(this.handleError(operation))
    );
  }

  /**
   * Obtener una orden por su ID.
   * @param orderID ID de la orden.
   * @returns Observable con la orden.
   */
  getOrderById(orderID: number): Observable<Order> {
    const operation = `GET Order By ID: ${orderID}`;
    return this.http.get<Order>(`${this.apiUrl}/Order/${orderID}`).pipe(
      tap(order => this.log(operation, order)),
      catchError(this.handleError(operation))
    );
  }

  /**
   * Crear una nueva orden.
   * @param order Datos de la orden a crear.
   * @returns Observable con la orden creada.
   */
  createOrder(order: Order): Observable<Order> {
    const operation = 'POST Create Order';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Order>(`${this.apiUrl}/Order`, order, { headers }).pipe(
      tap(newOrder => this.log(operation, newOrder)),
      catchError(this.handleError(operation))
    );
  }

  /**
   * Actualizar una orden existente por su ID.
   * @param orderID ID de la orden a actualizar.
   * @param updatedOrder Datos actualizados de la orden.
   * @returns Observable con la orden actualizada.
   */
  updateOrder(orderID: number, updatedOrder: Partial<Order>): Observable<Order> {
    const operation = `PUT Update Order ID: ${orderID}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Order>(`${this.apiUrl}/Order/${orderID}`, updatedOrder, { headers }).pipe(
      tap(updated => this.log(operation, updated)),
      catchError(this.handleError(operation))
    );
  }

  // -----------------------------------
  // Métodos para UsageLog
  // -----------------------------------

  /**
   * Obtener todos los registros de uso desde la API.
   * @returns Observable con la lista de registros de uso.
   */
  getUsageLogs(): Observable<UsageLog[]> {
    const operation = 'GET UsageLogs';
    return this.http.get<UsageLog[]>(`${this.apiUrl}/UsageLog`).pipe(
      tap(usageLogs => this.log(operation, usageLogs)),
      catchError(this.handleError(operation))
    );
  }

  /**
   * Obtener un registro de uso por su ID.
   * @param logID ID del registro de uso.
   * @returns Observable con el registro de uso.
   */
  getUsageLogById(logID: number): Observable<UsageLog> {
    const operation = `GET UsageLog By ID: ${logID}`;
    return this.http.get<UsageLog>(`${this.apiUrl}/UsageLog/${logID}`).pipe(
      tap(usageLog => this.log(operation, usageLog)),
      catchError(this.handleError(operation))
    );
  }

  /**
   * Crear un nuevo registro de uso.
   * @param usageLog Datos del registro de uso a crear.
   * @returns Observable con el registro de uso creado.
   */
  createUsageLog(usageLog: UsageLog): Observable<UsageLog> {
    const operation = 'POST Create UsageLog';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<UsageLog>(`${this.apiUrl}/UsageLog`, usageLog, { headers }).pipe(
      tap(newUsageLog => this.log(operation, newUsageLog)),
      catchError(this.handleError(operation))
    );
  }

  /**
   * Actualizar un registro de uso existente por su ID.
   * @param logID ID del registro de uso a actualizar.
   * @param updatedUsageLog Datos actualizados del registro de uso.
   * @returns Observable con el registro de uso actualizado.
   */
  updateUsageLog(logID: number, updatedUsageLog: Partial<UsageLog>): Observable<UsageLog> {
    const operation = `PUT Update UsageLog ID: ${logID}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<UsageLog>(`${this.apiUrl}/UsageLog/${logID}`, updatedUsageLog, { headers }).pipe(
      tap(updated => this.log(operation, updated)),
      catchError(this.handleError(operation))
    );
  }
}