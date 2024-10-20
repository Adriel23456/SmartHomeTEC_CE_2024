import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { MatTableModule } from '@angular/material/table';
import { NgFor, NgIf } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ErrorMessageComponent } from '../../error-message/error-message.component';
import { MatDialog } from '@angular/material/dialog';
import { EditAssignmentComponent } from './edit-assignment/edit-assignment.component';
import { DeviceService } from '../../../Services/Devices/Devices/devices.service';
import { DistributorService } from '../../../Services/Distributor/Distributor/distributor.service';
import { CreateAssignmentComponent } from './create-assignment/create-assignment.component';
import { DeleteDialogComponent } from '../../delete-dialog/delete-dialog.component';
import { catchError, concat, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-admin-store-management',
  templateUrl: './online-store-management.component.html',
  styleUrls: ['./online-store-management.component.css'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatTableModule,
    NgFor,
    NgIf,
    MatToolbarModule,
    MatIconModule,
  ],
})
export class OnlineStoreManagementComponent {
  assignments: any[] = []; 
  displayedColumns: string[] = [
    'idAssignment',
    'serialNumber',
    'distributorId',
    'deviceName',
    'distributorName',
  ]; 
  validationErrors: string[] = [];
  message: string = '';
  isFileLoaded = false; 
  selectedFile: File | null = null; 

  constructor(
    private dialog: MatDialog,
    private deviceService: DeviceService,
    private distributorService: DistributorService
  ) {}

  // Generates a new assignment ID based on serial number and legal number
  generateIdAssignment(serialNumber: string, legalNum: string): string {
    return `${serialNumber}${legalNum}`; // Concatenar los dos identificadores
  }

  // Checks if an assignment already exists in the assignments list
  assignmentExists(serialNumber: string, legalNum: string): boolean {
    return this.assignments.some(
      (assignment) => assignment.serialNumber === serialNumber && assignment.legalNum === legalNum
    );
  }

  // Handles file change and loads its content
  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>event.target;

    if (target.files.length !== 1) {
      throw new Error('No se puede cargar múltiples archivos a la vez');
    }

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const binaryStr: string = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName: string = workbook.SheetNames[0];
      const sheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      this.processExcelData(jsonData);

      this.isFileLoaded = true;
    };

    reader.readAsBinaryString(target.files[0]);
  }

  // Processes the data extracted from the Excel file
  processExcelData(data: any) {
    this.assignments = [];
    this.validationErrors = [];
    this.message = '';

    const expectedHeaders = ['idAssignment', 'serialNumber', 'legalNum'];
    const headers = data[0];

    if (!this.arrayEquals(expectedHeaders, headers)) {
      const message =
        'Error al cargar el archivo, no se encuentran los encabezados esperados: ' +
        expectedHeaders.join(', ');
      this.showErrorDialog(message);
      return;
    }

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const assignment = {
        idAssignment: row[0],
        serialNumber: row[1],
        legalNum: row[2],
        deviceName: '', 
        distributorName: '',
      };

      if (
        !this.isNumeric(assignment.idAssignment) ||
        !this.isNumeric(assignment.serialNumber) ||
        !this.isNumeric(assignment.legalNum)
      ) {
        this.validationErrors.push('[inv_in' + i + ']');
        continue;
      }

      this.assignments.push(assignment);

      this.deviceService
        .getDeviceNameBySerial(assignment.serialNumber)
        .pipe(
          tap((deviceName: string) => {
            assignment.deviceName = deviceName;
          }),
          catchError((error) => {
            console.error('Error al obtener el nombre del dispositivo:', error);
            assignment.deviceName = 'Desconocido';
            return of(null);
          })
        )
        .subscribe();

      this.distributorService
        .getDistributorNameById(assignment.legalNum)
        .pipe(
          tap((distributorName: string) => {
            assignment.distributorName = distributorName;
          }),
          catchError((error) => {
            console.error('Error al obtener el nombre del distribuidor:', error);
            assignment.distributorName = 'Desconocido';
            return of(null);
          })
        )
        .subscribe();
    }

    // Shows validation errors if there are any
    if (this.validationErrors.length != 0) {
      this.message =
        'Errores encontrados al cargar el archivo (Se ignoran entradas afectadas): ' +
        this.validationErrors.join(', ') +
        '.';
      this.showErrorDialog(this.message);
    }
  }

  // Shows a dialog with an error message
  showErrorDialog(errorMessage: string): void {
    this.dialog.open(ErrorMessageComponent, {
      width: '400px',
      data: { message: errorMessage },
    });
  }

  // Handles editing an assignment
  onEdit(assignment: any): void {
    const dialogRef = this.dialog.open(EditAssignmentComponent, {
      width: '600px',
      data: { ...assignment },
    });
    
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const previusIdAssignment = result.idAssignment;
        
        const newIdAssignment = this.generateIdAssignment(result.serialNumber, result.legalNum);

        if (this.assignmentExists(result.serialNumber, result.legalNum)) {
          this.showErrorDialog('Esta asignación ya existe y no puede ser duplicada.');
          return; 
        }
    
        const newAssignment = {
          idAssignment: newIdAssignment, 
          serialNumber: result.serialNumber, 
          legalNum: result.legalNum, 
          deviceName: result.deviceName, 
          distributorName: result.distributorName,
        };
        
        this.updateAssignment(previusIdAssignment, newAssignment);
      }
    });
  }

  // Handles creating a new assignment
  createAssignment(): void {
    const dialogRef = this.dialog.open(CreateAssignmentComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const newIdAssignment = this.generateIdAssignment(result.device.serialNumber, result.distributor.legalNum);

        if (this.assignmentExists(result.device.serialNumber, result.distributor.legalNum)) {
          this.showErrorDialog('Esta asignación ya existe y no puede ser duplicada.');
          return; 
        }

        const newAssignment = {
          idAssignment: newIdAssignment, 
          serialNumber: result.device.serialNumber, 
          legalNum: result.distributor.legalNum, 
          deviceName: result.device.name, 
          distributorName: result.distributor.name,
        };
        this.assignments.push(newAssignment);

        this.assignments = [...this.assignments];
      }
    });
  }

  // Handles editing an assignment
  updateAssignment(previusIdAssignment: number, updatedAssignment: any): void {
    const index = this.assignments.findIndex(
      (a) => a.idAssignment === previusIdAssignment
    );
    if (index !== -1) {
      this.assignments[index] = updatedAssignment;
      this.assignments = [...this.assignments];
    } else {
      const dialogRef = this.dialog.open(DeleteDialogComponent, {
        width: '400px',
        data: { message: `No se encontró la asignación` }
      });
    }
  }

  // Handles deleting an assignment
  onDelete(idAssignment: string, distributorName: string, deviceName: string): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data: { message: `¿Seguro que quieres borrar la asignación: ${distributorName} --> ${deviceName}?` }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.assignments = this.assignments.filter(
          (a) => a.idAssignment !== idAssignment
        );
      } else {
        console.log('Acción de borrar cancelada');
      }
    });
  }

  // Handles saving an assignment
  onSave(): void {
    const assignmentsToSave = this.assignments.map(({ idAssignment, serialNumber, legalNum }) => ({
      idAssignment,
      serialNumber,
      legalNum,
    }));
  
    const updateObservables = assignmentsToSave.map(assignment => {
      return this.deviceService.getDeviceBySerialNumber(assignment.serialNumber).pipe(
        switchMap(device => {
          if (device) {
            const updatedDevice = { ...device, legalNum: assignment.legalNum };
            return this.deviceService.updateDevice(device, updatedDevice).pipe(
              tap(() => {
                console.log(`Dispositivo ${device.serialNumber} actualizado con legalNum ${assignment.legalNum}`);
              }),
              catchError(error => {
                console.error(`Error al actualizar el dispositivo ${device.serialNumber}:`, error);
                return of(null); 
              })
            );
          } else {
            console.error(`Dispositivo con serialNumber ${assignment.serialNumber} no encontrado.`);
            return of(null);
          }
        }),
        catchError(error => {
          console.error(`Error al obtener el dispositivo ${assignment.serialNumber}:`, error);
          return of(null);
        })
      );
    });
  
    concat(...updateObservables).subscribe({
      complete: () => {
        console.log('Todos los dispositivos han sido actualizados.');
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(assignmentsToSave);
        const workbook: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Asignaciones');
        
        XLSX.writeFile(workbook, 'Asignaciones.xlsx');
      }
    });
  }

  // Compares two arrays to check if they are equal
  arrayEquals(a: any[], b: any[]): boolean {
    if (a.length !== b.length) return false;
    return a.every((val, index) => val === b[index]);
  }

  // Checks if a value is numeric
  isNumeric(value: any): boolean {
    return !isNaN(value) && isFinite(value);
  }
}
