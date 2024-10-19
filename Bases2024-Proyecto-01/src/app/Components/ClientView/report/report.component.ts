import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from '../../../Services/Authentication/Authentication/authentication.service';
import { UsageLogsService } from '../../../Services/UsageLogs/UsageLogs/usage-logs.service';
import { DeviceService } from '../../../Services/Devices/Devices/devices.service'; 
import { MatButtonModule } from '@angular/material/button';
import jsPDF from 'jspdf';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-report-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
  ],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent {
  constructor(
    public dialogRef: MatDialogRef<ReportComponent>,
    private authService: AuthenticationService,
    private usageLogsService: UsageLogsService,
    private deviceService: DeviceService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  async generateDeviceRanking(): Promise<void> {
    const currentUser = this.authService.currentUserValue;
  
    if (!currentUser) {
      console.error('No hay usuario autenticado.');
      return;
    }
  
    // Obtener los logs del usuario actual
    const userLogs = this.usageLogsService.getLogsByEmail(currentUser.email);
    const deviceUsage: { [serialNumber: number]: { totalUsage: number; name?: string } } = {};
  
    for (const log of userLogs) {
      // Obtener el número de serie a partir del assignedID
      const serialNumber = await firstValueFrom(this.usageLogsService.getSerialNumberByAssignedID(log.assignedID));
      const totalHours = this.calculateHours(log.startTime, log.endTime);
  
      if (serialNumber !== undefined && serialNumber !== null) {
        // Sumar las horas de uso por número de serie
        if (deviceUsage[serialNumber]) {
          deviceUsage[serialNumber].totalUsage += totalHours;
        } else {
          deviceUsage[serialNumber] = { totalUsage: totalHours };
        }
      } else {
        console.warn(`No se pudo obtener el serialNumber para assignedID ${log.assignedID}`);
      }
    }
  
    // Obtener el nombre del dispositivo para cada número de serie
    const namePromises = Object.keys(deviceUsage).map(async (serialNumber) => {
      const name = await firstValueFrom(this.deviceService.getDeviceNameBySerial(Number(serialNumber)));
      if (name) {
        deviceUsage[Number(serialNumber)].name = name;
      }
    });
  
    // Esperar a que todas las solicitudes se completen
    await Promise.all(namePromises);
  
    // Crear el PDF
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Ranking de Dispositivos Más Utilizados', 10, 10);
  
    // Agregar encabezados de la tabla
    let y = 30;
    doc.setFontSize(12);
    doc.text('Nombre del Dispositivo     Número de Serie     Total de Uso (horas)', 10, y);
    y += 10;
  
    // Ordenar el ranking por uso total
    const sortedDeviceUsage = Object.entries(deviceUsage).sort((a, b) => b[1].totalUsage - a[1].totalUsage);
  
    // Imprimir los datos de uso
    for (const [serialNumber, usage] of sortedDeviceUsage) {
      const entry = `${usage.name || 'Desconocido'}          ${serialNumber}          ${usage.totalUsage}`;
      doc.text(entry, 10, y);
      y += 10;
  
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
    }
  
    // Guardar el PDF
    doc.save('Ranking de Dispositivos.pdf');
  }  

  generateDailyUsageReport(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
        // Obtener los logs filtrados por el correo del usuario actual
        const userLogs = this.usageLogsService.getLogsByEmail(currentUser.email);

        const doc = new jsPDF();

        // Add title
        doc.setFontSize(16);
        doc.text('Reporte con los periodos del día con mayor uso de dispositivos', 10, 10);

        let mostFrequentPeriod = 'No definido';
        let timeRange = 'No definido';

        if (userLogs.length > 0) {
            mostFrequentPeriod = this.usageLogsService.getMostFrequentPeriod(userLogs);

            // Define the time range for the most frequent period
            if (mostFrequentPeriod === 'mañana') {
                timeRange = '06:00 - 11:59';
            } else if (mostFrequentPeriod === 'tarde') {
                timeRange = '12:00 - 18:59';
            } else {
                timeRange = '20:00 - 05:59';
            }
        } else {
            // No logs available, define the message
            timeRange = 'No hay horas disponibles';
        }

        // Add most frequent period section
        doc.setFontSize(12);
        doc.text(`El período del día en que más se utilizan los dispositivos es: ${mostFrequentPeriod}`, 10, 20);
        doc.text(`Rango de horas para este período: ${timeRange}`, 10, 30);

        // Add table headers
        let y = 40; // Starting Y position for logs
        doc.setFontSize(10);
        doc.text('Fecha de inicio     Fecha de fin     Hora de inicio     Hora de fin     Total de horas     ID asignado     ID del log     Correo', 10, y);
        y += 10; // Move down for the log entries

        // Check if there are no user logs and print a message
        if (userLogs.length === 0) {
            doc.text('No hay horas disponibles para este usuario.', 10, y);
        } else {
            // Loop through userLogs and print each log entry
            userLogs.forEach(log => {
                // Calcular las horas desde startTime y endTime
                const totalHours = this.calculateHours(log.startTime, log.endTime);

                // Crear una cadena para cada entrada de log
                const logEntry = `${log.startDate}     ${log.endDate}     ${log.startTime}     ${log.endTime}     ${totalHours.toFixed(2)}     ${log.assignedID}     ${log.logID}     ${log.clientEmail}`;
                doc.text(logEntry, 10, y);
                y += 10; // Incrementar posición Y para la siguiente entrada

                // Agregar nueva página si el contenido excede la altura de la página
                if (y > 280) { // Asumiendo que 295 es el margen inferior de la página
                    doc.addPage(); // Agregar nueva página
                    y = 10; // Reiniciar posición Y para la nueva página
                }
            });
        }

        // Save the PDF
        doc.save('Reporte uso Dispositivos.pdf');
    }
}

  
async generateMonthlyConsumption(): Promise<void> {
  const currentUser = this.authService.currentUserValue;

  if (currentUser) {
    // Filtrar logs del usuario actual
    const userLogs = this.usageLogsService.getLogsByEmail(currentUser.email);

    const consumptionData: { [serialNumber: number]: { totalHours: number; electricalConsumption?: number; totalElectricityCost?: number } } = {};

    for (const log of userLogs) {
      const totalHours = this.calculateHours(log.startTime, log.endTime);

      if (totalHours != null) {
        // Obtener el número de serie del dispositivo usando assignedID
        const serialNumber = await firstValueFrom(this.usageLogsService.getSerialNumberByAssignedID(log.assignedID));

        if (serialNumber !== undefined && serialNumber !== null) {
          // Acumular las horas de uso por número de serie
          if (consumptionData[serialNumber]) {
            consumptionData[serialNumber].totalHours += totalHours;
          } else {
            consumptionData[serialNumber] = { totalHours };
          }
        } else {
          console.warn(`No se pudo obtener el serialNumber para assignedID ${log.assignedID}`);
        }
      } else {
        console.warn(`Log con ID ${log.logID} tiene un totalHours inválido: ${totalHours}`);
      }
    }

    // Obtener el consumo eléctrico para cada número de serie
    const consumptionPromises = Object.keys(consumptionData).map(async (serialNumber) => {
      const electricalConsumption = await firstValueFrom(this.deviceService.getElectricalConsumptionBySerialNumber(Number(serialNumber)));
      consumptionData[Number(serialNumber)].electricalConsumption = electricalConsumption || 0;
    });

    // Esperar a que todas las solicitudes de consumo eléctrico se completen
    await Promise.all(consumptionPromises);

    // Calcular el costo total de electricidad por dispositivo y el total general
    let totalConsumption = 0;

    for (const data of Object.values(consumptionData)) {
      const totalElectricityCost = data.totalHours * (data.electricalConsumption || 0);
      data.totalElectricityCost = totalElectricityCost;
      totalConsumption += totalElectricityCost;
    }

    // Crear el PDF
    const doc = new jsPDF();

    // Agregar título
    doc.setFontSize(16);
    doc.text('Reporte Mensual de Consumo de Dispositivos', 10, 10);

    // Mostrar el total de consumo de todos los dispositivos
    doc.setFontSize(14);
    doc.text(`Total de consumo eléctrico para el mes anterior: ${totalConsumption.toFixed(2)}`, 10, 20);

    // Agregar encabezados de la tabla
    let y = 30;
    doc.setFontSize(12);
    doc.text('Número de serie     Total de horas     Consumo eléctrico     Costo total de electricidad', 10, y);
    y += 10;

    // Imprimir los datos de consumo
    for (const [serialNumber, data] of Object.entries(consumptionData)) {
      const entry = `${serialNumber}          ${data.totalHours}          ${data.electricalConsumption || 0}          ${data.totalElectricityCost?.toFixed(2) || 0}`;
      doc.text(entry, 10, y);
      y += 10;

      if (y > 280) {
        doc.addPage();
        y = 10;
      }
    }

    // Guardar el PDF
    doc.save('Reporte Mensual Consumo Dispositivos.pdf');
    }
  }

  
  // Función para calcular las horas entre dos tiempos
  private calculateHours(startTime: string, endTime: string): number {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
  
    let totalHours = 0;
  
    // Si el tiempo de fin es menor que el de inicio, significa que pasó a la siguiente jornada
    if (endHours < startHours || (endHours === startHours && endMinutes < startMinutes)) {
      totalHours += (24 - startHours) + endHours; // Total de horas hasta medianoche más horas hasta el fin
    } else {
      totalHours += endHours - startHours; // Diferencia de horas
    }
  
    // Sumar los minutos
    if (endMinutes < startMinutes) {
      totalHours -= 1; // Restar una hora si los minutos de fin son menores
      totalHours += (60 - startMinutes) + endMinutes; // Agregar los minutos
    } else {
      totalHours += (endMinutes - startMinutes) / 60; // Sumar la diferencia de minutos como fracción de horas
    }
  
    return totalHours; // Retorna el total de horas calculadas
  }
  
}