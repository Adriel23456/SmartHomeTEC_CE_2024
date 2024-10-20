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
    // Get the current logged-in user
    const currentUser: Client | null = this.authService.currentUserValue;
    if (currentUser && currentUser.region) {
      this.selectedRegion = currentUser.region;
    } else {
      this.selectedRegion = 'All';// Default region if none is set
    }
    // Load distributors on component initialization
    this.loadDistributors();
  }

  //Load all distributors and create a map of legalNum to region.
  loadDistributors(): void {
    this.distributorService.getDistributors().subscribe({
      next: (distributors) => {
        this.distributors = distributors;
        this.distributorMap = new Map(distributors.map(d => [d.legalNum, d.region]));
        console.log('Distribuidores cargados:', this.distributors);
        console.log('Mapa de distribuidores:', this.distributorMap);

        this.loadDevices();
      },
      error: (error) => {
        console.error('Error al cargar distribuidores:', error);
        // Handle error if distributor loading fails
      }
    });
  }

  // Load all devices from the API.
  loadDevices(): void {
    this.deviceService.getDevices().pipe(
      tap((devices) => {
        this.devices = devices;// Store the loaded devices
        console.log('Dispositivos cargados:', this.devices);
        this.filterProducts();// Filter products after loading devices
      }),
      catchError((error) => {
        console.error('Error al cargar dispositivos:', error);
        return of([]);// Return an empty observable if error occurs
      })
    ).subscribe();
  }

  //Filters the devices based on the selected region.
  filterProducts() {
    console.log('selectedRegion:', this.selectedRegion);// Log selected region for debugging
    const normalizedSelectedRegion = this.normalizeString(this.selectedRegion);// Normalize region string for comparison


    this.filteredProducts = this.devices.filter((device) => {
      console.log('Revisando dispositivo:', device);
      if (this.selectedRegion === 'ALL') return true;
      if (device.legalNum === null) return false;

      const deviceRegion = this.distributorMap.get(device.legalNum);
      console.log(`Dispositivo ${device.serialNumber} región:`, deviceRegion);

      const normalizedDeviceRegion = this.normalizeString(deviceRegion || '');// Normalize the device region
      return normalizedDeviceRegion === normalizedSelectedRegion;// Return true if region matches
    });

    console.log('Productos después del filtrado:', this.filteredProducts);// Log the filtered products
  }

  /**
   * Normalizes a string by removing accents and converting to lowercase.
   * @param str String to normalize
   * @returns Normalized string
   */
  normalizeString(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  //Filters and searches devices based on the search term and selected region.
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

  //Clears the search field and resets the product list.
  clearSearch() {
    this.searchTerm = ''; // Clear the search term
    this.searchFunction(); // Update the list to show all products
  }
/**
   * Generates an order and PDF invoice for the selected product.
   * @param product Product for which to generate the invoice
   */
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
  
          // Create the order
          return this.ordersService.addOrder(newOrder).pipe(
            tap((order) => {
              console.log('Orden agregada:', order);
  
              // Add order details to the PDF
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
  
              // Save PDF
              doc.save(`${product.name}_Factura.pdf`);
              this.generateGarant(product);
            }),
            catchError((error) => {
              console.error('Error al agregar la orden:', error);
              return of(null);
            })
          );
        }),
        catchError((error) => {
          console.error('Error al obtener el conteo de órdenes:', error);
          return of(null);
        })
      )
      .subscribe();
  }  

  generateGarant(product: any): void {
    // Get the current date and format it for display
    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, '0')}-${currentDate.getFullYear()}`;
    const formattedDateFinish = `${String(currentDate.getDate()).padStart(2, '0')}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, '0')}-${currentDate.getFullYear() + 1}`;
  // Retrieve the current user from the AuthenticationService
    const currentUser: Client | null = this.authService.currentUserValue;
  // Handle case where the current user is not found
    if (!currentUser) {
      console.error('No se encontró el usuario actual.');
      return;
    }
  
    
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Certificado de garantía del ${product.name}`, 10, 10);
  // Set the initial vertical position (y-axis) for the content
    let y = 20;
    // Add content to the PDF document
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
  
    // Save the PDF file with a name based on the product name
    doc.save(`${product.name}_Garantía.pdf`);
  
     // Update the device state after generating the warranty certificate
    this.updateState(product.serialNumber, 'Local');
  }  

  updateState(serialNumber: number, newState: string): void {
    this.deviceService.updateStateBySerialNumber(serialNumber, newState).pipe(
      tap(() => {
        console.log(`Estado del dispositivo con número de serie ${serialNumber} actualizado a: ${newState}`);
      }),
      catchError((error) => {
        console.error(`Error al actualizar el estado del dispositivo con serialNumber ${serialNumber}:`, error);
        // Handle error if necessary
        return of(null); // Continue flow even in case of an error
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
    // Get the current user from the authentication service
    const currentUser = this.authService.currentUserValue;
    console.log('user', currentUser);
    // Open the edit user dialog with the current user data
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '600px',
      height: '550px',
      data: { client: currentUser }// Pass the current user data to the dialog
    });
  // Handle the result after the dialog is closed
    dialogRef.afterClosed().pipe(
      switchMap(result => {
        if (result) {
          // Update the client with the new data
          return this.clientService.updateClient(currentUser, result).pipe(
            tap(() => {
              console.log('Cliente actualizado:', result);
            }),
            catchError(error => {
              console.error('Error al actualizar el cliente:', error);
              // Handle the error if necessary
              return of(null);
            })
          );
        } else {
          // If no result (dialog was canceled), return an empty observable
          return of(null);
        }
      })
    ).subscribe();
  }  
}