import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { ApiService } from '../../Comunication/api-service.service';
import { AssignedDevice, AssignedDeviceService } from '../../AssignedDevice/assigned-device.service';

export interface UsageLog {
  logID: number;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  totalHours: number | null;
  clientEmail: string;
  assignedID: number;
}

@Injectable({
  providedIn: 'root'
})
export class UsageLogsService {
  private usageLogs: UsageLog[] = [];

  constructor(private apiService: ApiService, private assignedDeviceService: AssignedDeviceService) {
    this.loadUsageLogs();
  }

  /**
   * Carga todos los registros de uso desde la API y los almacena localmente.
   */
  private loadUsageLogs(): void {
    this.apiService.getUsageLogs().subscribe({
      next: (logs: UsageLog[]) => {
        this.usageLogs = logs;
        console.log('Usage Logs cargados:', this.usageLogs);
      },
      error: (error) => {
        console.error('Error al cargar Usage Logs:', error);
      }
    });
  }

  /**
   * Obtener los registros de uso filtrados por email de usuario.
   * @param userEmail Email del usuario.
   * @returns Observable con la lista de registros de uso filtrados.
   */
  getLogsByEmail(userEmail: string): UsageLog[] {
    const operation = `GET UsageLogs by Email: ${userEmail}`;
    const filteredLogs = this.usageLogs.filter(log => log.clientEmail === userEmail);
    this.log(operation, filteredLogs);
    return filteredLogs;
  }

  /**
   * Registra la operación y los datos asociados.
   * @param operation Nombre de la operación.
   * @param data Datos a registrar.
   */
  private log(operation: string, data: any): void {
    console.log(`${operation} - Datos:`, data);
  }

  classifyPeriod(hour: number): 'mañana' | 'tarde' | 'noche' {
    if (hour >= 6 && hour < 12) {
      return 'mañana';
    } else if (hour >= 12 && hour < 19) {
      return 'tarde';
    } else {
      return 'noche';
    }
  }

  getMostFrequentPeriod(userLogs: UsageLog[]): string {
    const periodCount = { mañana: 0, tarde: 0, noche: 0 };

    userLogs.forEach(log => {
      const startHour = parseInt(log.startTime.split(':')[0], 10);
      const endHour = parseInt(log.endTime.split(':')[0], 10);

      const startPeriod = this.classifyPeriod(startHour);
      const endPeriod = this.classifyPeriod(endHour);

      periodCount[startPeriod]++;
      if (startPeriod !== endPeriod) {
        periodCount[endPeriod]++;
      }
    });

    const mostFrequent = Object.entries(periodCount).reduce((a, b) => a[1] > b[1] ? a : b);
    return mostFrequent[0];
  }

  /**
   * Obtiene el serialNumber asociado a un assignedID.
   * @param assignedID ID de la asignación.
   * @returns Observable con el serialNumber del dispositivo.
   */
  getSerialNumberByAssignedID(assignedID: number): Observable<number> {
    return this.assignedDeviceService.getAssignedDeviceById(assignedID).pipe(
      map((assignedDevice: AssignedDevice) => assignedDevice.serialNumberDevice),
      tap(serialNumber => this.log(`Obtenido serialNumber ${serialNumber} para assignedID ${assignedID}`, serialNumber)),
      catchError(error => {
        console.error(`Error al obtener serialNumber para assignedID ${assignedID}:`, error);
        return throwError(() => new Error(`Error al obtener serialNumber: ${error.message}`));
      })
    );
  }
}
