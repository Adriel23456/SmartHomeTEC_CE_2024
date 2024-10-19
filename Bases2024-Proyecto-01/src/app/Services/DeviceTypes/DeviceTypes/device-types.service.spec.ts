import { TestBed } from '@angular/core/testing';

import { DeviceTypesService } from './device-types.service';

describe('DeviceTypesService', () => {
  let service: DeviceTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
