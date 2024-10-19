import { Routes } from '@angular/router';
import { AuthenticationComponent } from './Components/Authentication/authentication/authentication.component';
import { AdminViewComponent } from './Components/AdminView/admin-view/admin-view.component';
import { DashboardComponent } from './Components/AdminView/dashboard/dashboard.component';
import { DeviceManagementComponent } from './Components/AdminView/device-management/device-management.component';
import { DistributorManagementComponent } from './Components/AdminView/distributor-management/distributor-management.component';
import { OnlineStoreManagementComponent } from './Components/AdminView/online-store-management/online-store-management.component';
import { AuthenticationGuard } from './Guards/AuthenticationGuard/authentication-guard.guard';
import { ClientViewComponent } from "./Components/ClientView/client-view/client-view.component";

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: AuthenticationComponent },
    { 
        path: 'sidenavAdmin',
        component: AdminViewComponent,
        canActivate: [AuthenticationGuard], //protegiendo la ruta
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent},
            { path: 'deviceManagement', component: DeviceManagementComponent},
            { path: 'dealerManagement', component: DistributorManagementComponent},
            { path: 'storeManagement', component: OnlineStoreManagementComponent}
        ]
    },
    { path: 'sidenavClient', component: ClientViewComponent},
    { path: '**', redirectTo: '/login' }
];
