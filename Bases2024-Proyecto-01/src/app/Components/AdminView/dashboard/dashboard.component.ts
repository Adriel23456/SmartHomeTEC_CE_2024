import { Component, OnInit} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { DeviceService, Device } from '../../../Services/Devices/Devices/devices.service';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DistributorService, Region } from '../../../Services/Distributor/Distributor/distributor.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatCardModule,
    MatTableModule,
    MatToolbarModule,
    MatIconModule,
    MatGridListModule,
    MatDividerModule,
    CommonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  router = inject(Router);
  devices: Device[] = [];
  avgDevicesPerUser: number = 0;
  totalManagedDevices: number = 0;
  devicesByRegion: { region: string; deviceCount: number }[] = [];

  constructor(
    //service initialization
    private deviceService: DeviceService,
    private distributorService: DistributorService
  ) {}

  //data inilization
  ngOnInit(): void {
    this.deviceService.getAssignedDevices().subscribe((data) => {
      this.devices = data;   
    });

    
    this.deviceService.getDevices().subscribe(devices => {
      const length = devices.length;
      this.totalManagedDevices = length;
    });

    //gettin the region list using the distributorService
    this.distributorService.getRegions().subscribe((regions: Region[]) => {
      //Iterates over the list to get the number of devices
      regions.forEach(region => {
        this.deviceService.getDeviceCountByRegion(region.region).subscribe(count => {
          this.devicesByRegion.push({ region: region.region, deviceCount: count });
        });
      });
    });

    // The device service is called to get the average number of devices per user
    this.deviceService.getAvgDevicesPerUser().subscribe((avg : number) => {
      this.avgDevicesPerUser = Math.round(avg);
    });
  }
    
  onLogOutClick(){
    this.router.navigate(['/login'])
  };
}
