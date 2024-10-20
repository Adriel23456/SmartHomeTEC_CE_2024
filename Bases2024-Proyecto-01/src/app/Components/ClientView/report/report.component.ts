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
 // Method to close the dialog
  onNoClick(): void {
    this.dialogRef.close();
  }
// Asynchronous method to generate device usage ranking PDF
  async generateDeviceRanking(): Promise<void> {
    const currentUser = this.authService.currentUserValue;// Get current authenticated user
  
    if (!currentUser) {
      console.error('No hay usuario autenticado.');// Log error if no user is authenticated
      return;
    }
  
    // Retrieve logs for the current user
    const userLogs = this.usageLogsService.getLogsByEmail(currentUser.email);
    const deviceUsage: { [serialNumber: number]: { totalUsage: number; name?: string } } = {};
  // Loop through user logs to calculate total usage per device
    for (const log of userLogs) {
      // Get serial number from assignedID
      const serialNumber = await firstValueFrom(this.usageLogsService.getSerialNumberByAssignedID(log.assignedID));
      const totalHours = this.calculateHours(log.startTime, log.endTime);
  
      if (serialNumber !== undefined && serialNumber !== null) {
        // Sum total usage hours for each device
        if (deviceUsage[serialNumber]) {
          deviceUsage[serialNumber].totalUsage += totalHours;
        } else {
          deviceUsage[serialNumber] = { totalUsage: totalHours };
        }
      } else {
        console.warn(`No se pudo obtener el serialNumber para assignedID ${log.assignedID}`);
      }
    }
  
    // Fetch device names for each serial number
    const namePromises = Object.keys(deviceUsage).map(async (serialNumber) => {
      const name = await firstValueFrom(this.deviceService.getDeviceNameBySerial(Number(serialNumber)));
      if (name) {
        deviceUsage[Number(serialNumber)].name = name;// Set device name
      }
    });
  
    // Wait for all name requests to complete
    await Promise.all(namePromises);
  
    // Create PDF document
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Ranking de Dispositivos Más Utilizados', 10, 10);
  
    // Add table headers
    let y = 30;
    doc.setFontSize(12);
    doc.text('Nombre del Dispositivo     Número de Serie     Total de Uso (horas)', 10, y);
    y += 10;
  
    // Sort device usage by total hours and print data
    const sortedDeviceUsage = Object.entries(deviceUsage).sort((a, b) => b[1].totalUsage - a[1].totalUsage);

    for (const [serialNumber, usage] of sortedDeviceUsage) {
      const entry = `${usage.name || 'Desconocido'}          ${serialNumber}          ${usage.totalUsage}`;
      doc.text(entry, 10, y);
      y += 10;
  // Add new page if content exceeds height
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
    }
  
    doc.save('Ranking de Dispositivos.pdf');
  }  
// Method to generate daily usage report PDF
  generateDailyUsageReport(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
        // Filter logs by current user's email
        const userLogs = this.usageLogsService.getLogsByEmail(currentUser.email);

        const doc = new jsPDF();

         // Add title to the document
        doc.setFontSize(16);
        doc.text('Reporte con los periodos del día con mayor uso de dispositivos', 10, 10);

        let mostFrequentPeriod = 'No definido';
        let timeRange = 'No definido';

        if (userLogs.length > 0) {
            mostFrequentPeriod = this.usageLogsService.getMostFrequentPeriod(userLogs);// Get most frequent usage period

            // Define the time range based on the most frequent period
            if (mostFrequentPeriod === 'mañana') {
                timeRange = '06:00 - 11:59';
            } else if (mostFrequentPeriod === 'tarde') {
                timeRange = '12:00 - 18:59';
            } else {
                timeRange = '20:00 - 05:59';
            }
        } else {
            // Define message if no logs are available
            timeRange = 'No hay horas disponibles';
        }

        // Add most frequent period section to PDF
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
                // Calculate hours from startTime and endTime
                const totalHours = this.calculateHours(log.startTime, log.endTime);

                // Create a string for each log entry
                const logEntry = `${log.startDate}     ${log.endDate}     ${log.startTime}     ${log.endTime}     ${totalHours.toFixed(2)}     ${log.assignedID}     ${log.logID}     ${log.clientEmail}`;
                doc.text(logEntry, 10, y);
                y += 10; // Increment Y position for the next entry

                // Add new page if content exceeds the height of the page
                if (y > 280) { 
                    doc.addPage(); // Add new page
                    y = 10;// Reset Y position for the new page
                }
            });
        }

        // Save the PDF document
        doc.save('Reporte uso Dispositivos.pdf');
    }
}

 // Method to generate monthly consumption report PDF 
async generateMonthlyConsumption(): Promise<void> {
  const currentUser = this.authService.currentUserValue;

  if (currentUser) {
    // Filter logs for the current user
    const userLogs = this.usageLogsService.getLogsByEmail(currentUser.email);

    const consumptionData: { [serialNumber: number]: { totalHours: number; electricalConsumption?: number; totalElectricityCost?: number } } = {};

    for (const log of userLogs) {
      const totalHours = this.calculateHours(log.startTime, log.endTime);
      // Get device serial number using assignedID
      if (totalHours != null) {
        
        const serialNumber = await firstValueFrom(this.usageLogsService.getSerialNumberByAssignedID(log.assignedID));

        if (serialNumber !== undefined && serialNumber !== null) {
          // Accumulate usage hours by serial number
          if (consumptionData[serialNumber]) {
            consumptionData[serialNumber].totalHours += totalHours;
          } else {
            consumptionData[serialNumber] = { totalHours };
          }
        } else {
          console.warn(`No se pudo obtener el serialNumber para assignedID ${log.assignedID}`);// Log warning if serial number is not found
        }
      } else {
        console.warn(`Log con ID ${log.logID} tiene un totalHours inválido: ${totalHours}`);// Log warning for invalid totalHours
      }
    }

    // Retrieve electrical consumption for each serial number
    const consumptionPromises = Object.keys(consumptionData).map(async (serialNumber) => {
      const electricalConsumption = await firstValueFrom(this.deviceService.getElectricalConsumptionBySerialNumber(Number(serialNumber)));
      consumptionData[Number(serialNumber)].electricalConsumption = electricalConsumption || 0;
    });

    // Wait for all consumption requests to complete
    await Promise.all(consumptionPromises);

    // Calculate total electricity cost per device and overall total
    let totalConsumption = 0;

    for (const data of Object.values(consumptionData)) {
      const totalElectricityCost = data.totalHours * (data.electricalConsumption || 0);// Calculate cost
      data.totalElectricityCost = totalElectricityCost;// Store cost
      totalConsumption += totalElectricityCost;// Accumulate total consumption
    }

     // Create PDF document
    const doc = new jsPDF();

   
    doc.setFontSize(16);
    doc.text('Reporte Mensual de Consumo de Dispositivos', 10, 10);

    
    doc.setFontSize(14);
    doc.text(`Total de consumo eléctrico para el mes anterior: ${totalConsumption.toFixed(2)}`, 10, 20);

    // Add table headers
    let y = 30;
    doc.setFontSize(12);
    doc.text('Número de serie     Total de horas     Consumo eléctrico     Costo total de electricidad', 10, y);
    y += 10;

    /// Print data for each device
    for (const [serialNumber, data] of Object.entries(consumptionData)) {
      const entry = `${serialNumber}          ${data.totalHours}          ${data.electricalConsumption || 0}          ${data.totalElectricityCost?.toFixed(2) || 0}`;
      doc.text(entry, 10, y);
      y += 10;
// Add new page if content exceeds height
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
    }

    
    doc.save('Reporte Mensual Consumo Dispositivos.pdf');
    }
  }

  
 // Helper method to calculate total hours between start and end times
  private calculateHours(startTime: string, endTime: string): number {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
  
    let totalHours = 0;
  
   
    if (endHours < startHours || (endHours === startHours && endMinutes < startMinutes)) {
      totalHours += (24 - startHours) + endHours; 
    } else {
      totalHours += endHours - startHours; 
    }

    if (endMinutes < startMinutes) {
      totalHours -= 1; 
      totalHours += (60 - startMinutes) + endMinutes; 
    } else {
      totalHours += (endMinutes - startMinutes) / 60; 
    }
  
    return totalHours; 
  }
  
}