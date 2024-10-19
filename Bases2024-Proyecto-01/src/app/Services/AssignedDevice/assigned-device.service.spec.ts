import { TestBed } from '@angular/core/testing';

import { AssignedDeviceService } from './assigned-device.service';

describe('AssignedDeviceService', () => {
  let service: AssignedDeviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssignedDeviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
