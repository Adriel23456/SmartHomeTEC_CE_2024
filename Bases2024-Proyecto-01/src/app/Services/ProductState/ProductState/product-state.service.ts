import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface ProductState {
  state: string;
}

const PRODUCTSTATES: ProductState[] = [
  {
    state: 'AdminRegistered'
  },
  {
    state: 'StoreAvailable'
  },
  {
    state: 'Local'
  }
  
];

@Injectable({
  providedIn: 'root'
})
export class ProductStateService {

  constructor() { }

  getProductStates(): Observable<ProductState[]> {
    return of(PRODUCTSTATES);
  }
}
