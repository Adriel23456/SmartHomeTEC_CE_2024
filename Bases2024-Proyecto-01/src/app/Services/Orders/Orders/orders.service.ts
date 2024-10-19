import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { ApiService } from '../../Comunication/api-service.service';

export interface Order {
  orderID: number | null;
  state: string;
  orderTime: string;
  orderDate: string;
  orderClientNum: number | null;
  brand: string | null;
  serialNumberDevice: number;
  deviceTypeName: string;
  totalPrice: number | null;
  clientEmail: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private apiService: ApiService) { }

  /**
   * Crear una nueva orden.
   * @param order Datos de la orden a crear.
   * @returns Observable con la orden creada.
   */
  addOrder(order: Order): Observable<Order> {
    return this.apiService.createOrder(order).pipe(
      tap(newOrder => console.log('Order created:', newOrder)),
      catchError(error => this.handleError('createOrder', error))
    );
  }

  /**
   * Obtener todas las órdenes desde la API.
   * @returns Observable con la lista de órdenes.
   */
  getOrders(): Observable<Order[]> {
    return this.apiService.getOrders().pipe(
      tap(orders => console.log('Orders fetched:', orders)),
      catchError(error => this.handleError('getOrders', error))
    );
  }

  /**
   * Obtener el conteo total de órdenes desde la API.
   * @returns Observable<number> con el número total de órdenes.
   */
  getOrderCount(): Observable<number> {
    const operation = 'GET Order Count';
    return this.apiService.getOrders().pipe(
      map((orders: Order[]) => orders.length),
      tap(count => console.log(`${operation} - Total Orders:`, count)),
      catchError(error => this.handleError(operation, error))
    );
  }

  /**
   * Obtener una orden por su ID.
   * @param orderID ID de la orden.
   * @returns Observable con la orden.
   */
  getOrderById(orderID: number): Observable<Order> {
    return this.apiService.getOrderById(orderID).pipe(
      tap(order => console.log('Order fetched:', order)),
      catchError(error => this.handleError('getOrderById', error))
    );
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
