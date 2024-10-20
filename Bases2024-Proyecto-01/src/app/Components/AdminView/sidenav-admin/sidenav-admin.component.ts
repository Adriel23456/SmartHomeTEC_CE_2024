import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthenticationService } from '../../../Services/Authentication/Authentication/authentication.service';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { inject } from '@angular/core';


@Component({
  selector: 'app-sidenav-admin',
  standalone: true,
  imports: [
    MatCardModule, 
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    RouterOutlet
  ],
  templateUrl: './sidenav-admin.component.html',
  styleUrl: './sidenav-admin.component.css'
})
export class SidenavAdminComponent {
  constructor(
    private authenticationService: AuthenticationService,
  ){}
  router = inject(Router);

  // Handle the click event for the dashboard button and navigate to the corresponding route.
  onDashboardClick(){
    this.router.navigate(['/sidenavAdmin/dashboard']);
  }
  // Handle the click event for the device management button and navigate to the corresponding route.
  onDeviceManagementClick(){
    this.router.navigate(['/sidenavAdmin/deviceManagement'])
  };

  // Handle the click event for the dealer management button and navigate to the corresponding route.
  onDealerManagementClick(){
    this.router.navigate(['/sidenavAdmin/dealerManagement'])
  };
  
  // Handle the click event for the store management button and navigate to the corresponding route.
  onStoreManagementClick(){
    this.router.navigate(['/sidenavAdmin/storeManagement'])
  };

  // Handle the click event for logging out, redirect to login and call the logout method from the authentication service.
  onLogOutClick(){
    this.router.navigate(['/login'])
    this.authenticationService.logout();
  };

}
