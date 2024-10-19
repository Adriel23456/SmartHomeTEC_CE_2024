import { Component } from '@angular/core';
import { StoreComponent } from "../store/store.component";
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-client-view',
  standalone: true,
  imports: [StoreComponent,
    MatCardModule,
    MatTableModule,
    MatToolbarModule,
    MatIconModule,
    MatGridListModule,
    MatDividerModule
  ],
  templateUrl: './client-view.component.html',
  styleUrl: './client-view.component.css'
})
export class ClientViewComponent {

}
