import { Component, numberAttribute, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthenticationService } from '../../../Services/Authentication/Authentication/authentication.service';
import { ClientService, Client } from '../../../Services/Clients/Clients/clients.service';
import jsPDF from 'jspdf';
import { MatDialog } from '@angular/material/dialog';
import { ReportComponent } from '../report/report.component';
import { DeviceService, Device } from '../../../Services/Devices/Devices/devices.service';
import { OrdersService,Order } from '../../../Services/Orders/Orders/orders.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { Distributor, DistributorService } from '../../../Services/Distributor/Distributor/distributor.service';
import { catchError, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-tienda',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
  ],

  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css'],
})
export class StoreComponent implements OnInit {
  devices: Device[] = [];
  distributors: Distributor[] = [];
  distributorMap: Map<number, string> = new Map();
  selectedRegion: string = '';
  searchTerm: string = '';
  filteredProducts: any[] = [];

  constructor(
    private dialog: MatDialog,
    private clientService: ClientService,
    private authService: AuthenticationService,
    private deviceService: DeviceService,
    private ordersService: OrdersService,
    private distributorService: DistributorService
  ) {}

  ngOnInit(): void {
    // Obtén el usuario actual
    const currentUser: Client | null = this.authService.currentUserValue;
    // Si hay un usuario, establece su región; de lo contrario, 'ALL'
    if (currentUser && currentUser.region) {
      this.selectedRegion = currentUser.region;
    } else {
      this.selectedRegion = 'All';
    }
    // Cargar distribuidores y luego dispositivos
    this.loadDistributors();
  }

  /**
   * Carga todos los distribuidores y crea un mapa de legalNum a region.
   */
  loadDistributors(): void {
    this.distributorService.getDistributors().subscribe({
      next: (distributors) => {
        this.distributors = distributors;
        this.distributorMap = new Map(distributors.map(d => [d.legalNum, d.region]));
        console.log('Distribuidores cargados:', this.distributors);
        console.log('Mapa de distribuidores:', this.distributorMap);

        // Cargar dispositivos después de cargar distribuidores
        this.loadDevices();
      },
      error: (error) => {
        console.error('Error al cargar distribuidores:', error);
        // Manejar el error si es necesario
      }
    });
  }

  /**
   * Carga todos los dispositivos desde la API.
   */
  loadDevices(): void {
    this.deviceService.getDevices().pipe(
      tap((devices) => {
        this.devices = devices;
        console.log('Dispositivos cargados:', this.devices);
        this.filterProducts();
      }),
      catchError((error) => {
        console.error('Error al cargar dispositivos:', error);
        // Manejar el error si es necesario
        return of([]);
      })
    ).subscribe();
  }

  /**
   * Filtra los dispositivos basándose en la región seleccionada.
   */
  filterProducts() {
    console.log('selectedRegion:', this.selectedRegion);
    const normalizedSelectedRegion = this.normalizeString(this.selectedRegion);

    this.filteredProducts = this.devices.filter((device) => {
      console.log('Revisando dispositivo:', device);
      if (this.selectedRegion === 'ALL') return true;
      if (device.legalNum === null) return false;

      const deviceRegion = this.distributorMap.get(device.legalNum);
      console.log(`Dispositivo ${device.serialNumber} región:`, deviceRegion);

      const normalizedDeviceRegion = this.normalizeString(deviceRegion || '');
      return normalizedDeviceRegion === normalizedSelectedRegion;
    });

    console.log('Productos después del filtrado:', this.filteredProducts);
  }

  /**
   * Normaliza una cadena eliminando acentos y convirtiéndola a minúsculas.
   * @param str Cadena a normalizar
   * @returns Cadena normalizada
   */
  normalizeString(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  /**
   * Filtra y busca dispositivos basándose en el término de búsqueda y la región seleccionada.
   */
  searchFunction() {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredProducts = this.devices.filter((device) => {
      const matchesName = device.name.toLowerCase().includes(term);
      let matchesRegion = false;
      if (this.selectedRegion === 'ALL') {
        matchesRegion = true;
      } else if (device.legalNum !== null) {
        const deviceRegion = this.distributorMap.get(device.legalNum);
        matchesRegion = deviceRegion === this.selectedRegion;
      }
      return matchesName && matchesRegion;
    });
  }

  // Función que limpia el campo de búsqueda y reinicia la lista de productos
  clearSearch() {
    this.searchTerm = ''; // Limpia el campo de búsqueda
    this.searchFunction(); // Actualiza la lista para mostrar todos los productos
  }

  generateFact(product: any): void {
    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, '0')}-${currentDate.getFullYear()}`;
    const formattedTime = `${String(currentDate.getHours()).padStart(2, '0')}:${String(
      currentDate.getMinutes()
    ).padStart(2, '0')}:${String(currentDate.getSeconds()).padStart(2, '0')}`;
  
    this.ordersService
      .getOrderCount()
      .pipe(
        switchMap((orderCount) => {
          const newOrder: Order = {
            orderID: orderCount + 1,
            totalPrice: product.price,
            state: 'Ordered',
            orderTime: formattedTime,
            orderDate: formattedDate,
            orderClientNum: 0,
            brand: product.brand,
            serialNumberDevice: product.serialNumber,
            deviceTypeName: product.name,
            clientEmail: this.authService.currentUserValue?.email || '',
          };
  
          // Agregar la orden al servicio
          return this.ordersService.addOrder(newOrder).pipe(
            tap((order) => {
              console.log('Orden agregada:', order);
  
              // Generar el PDF
              const doc = new jsPDF();
              doc.setFontSize(16);
              doc.text(`Detalles de compra del ${product.name}`, 10, 10);
              let y = 20;
              doc.text(`Factura número ${newOrder.orderID}`, 10, y);
              y += 10;
              doc.text(`serialNumber: ${product.serialNumber}`, 10, y);
              y += 10;
              doc.text(`Precio: $${product.price}`, 10, y);
              y += 10;
              doc.text(`Categoría del dispositivo: ${product.deviceTypeName}`, 10, y);
              y += 10;
              doc.text(`Descripción: ${product.description}`, 10, y);
              y += 10;
              doc.text(
                `Compra realizada el ${newOrder.orderDate} a las ${newOrder.orderTime}`,
                10,
                y
              );
  
              // Guarda el PDF
              doc.save(`${product.name}_Factura.pdf`);
              this.generateGarant(product);
            }),
            catchError((error) => {
              console.error('Error al agregar la orden:', error);
              // Manejar el error si es necesario
              return of(null);
            })
          );
        }),
        catchError((error) => {
          console.error('Error al obtener el conteo de órdenes:', error);
          // Manejar el error si es necesario
          return of(null);
        })
      )
      .subscribe();
  }  

  generateGarant(product: any): void {
    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, '0')}-${currentDate.getFullYear()}`;
    const formattedDateFinish = `${String(currentDate.getDate()).padStart(2, '0')}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, '0')}-${currentDate.getFullYear() + 1}`;
  
    const currentUser: Client | null = this.authService.currentUserValue;
  
    if (!currentUser) {
      console.error('No se encontró el usuario actual.');
      // Manejar el error si es necesario
      return;
    }
  
    // Generar el PDF
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Certificado de garantía del ${product.name}`, 10, 10);
  
    let y = 20;
    doc.text(
      `Compra realizada por ${currentUser.firstName} ${currentUser.middleName} ${currentUser.lastName}`,
      10,
      y
    );
    y += 10;
    doc.text(`serialNumber: ${product.serialNumber}`, 10, y);
    y += 10;
    doc.text(`Categoría del dispositivo: ${product.deviceTypeName}`, 10, y);
    y += 10;
    doc.text(`Marca: ${product.brand}`, 10, y);
    y += 10;
    doc.text(`Monto Total: $${product.price}`, 10, y);
    y += 10;
    doc.text(`Compra realizada el ${formattedDate}`, 10, y);
    y += 10;
    doc.text(`La garantía termina el ${formattedDateFinish}`, 10, y);
  
    // Guarda el PDF
    doc.save(`${product.name}_Garantía.pdf`);
  
    // Actualizar el estado del dispositivo con protección
    this.updateState(product.serialNumber, 'Local');
  }  

  updateState(serialNumber: number, newState: string): void {
    this.deviceService.updateStateBySerialNumber(serialNumber, newState).pipe(
      tap(() => {
        console.log(`Estado del dispositivo con número de serie ${serialNumber} actualizado a: ${newState}`);
      }),
      catchError((error) => {
        console.error(`Error al actualizar el estado del dispositivo con serialNumber ${serialNumber}:`, error);
        // Manejar el error si es necesario
        return of(null); // Continuar el flujo aunque ocurra un error
      })
    ).subscribe();
  }

  openDialogReports(): void {
    const dialogRef = this.dialog.open(ReportComponent, {
      width: '500px',
      height: '325px',
    });
  }
  openDialogEditUser(): void {
    const currentUser = this.authService.currentUserValue;
    console.log('user', currentUser);
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '600px',
      height: '550px',
      data: { client: currentUser }
    });
  
    dialogRef.afterClosed().pipe(
      switchMap(result => {
        if (result) {
          // Actualizar el cliente con los datos nuevos
          return this.clientService.updateClient(currentUser, result).pipe(
            tap(() => {
              console.log('Cliente actualizado:', result);
            }),
            catchError(error => {
              console.error('Error al actualizar el cliente:', error);
              // Manejar el error si es necesario
              return of(null);
            })
          );
        } else {
          // Si no hay resultado (el diálogo fue cancelado), retornamos un Observable vacío
          return of(null);
        }
      })
    ).subscribe();
  }  
}