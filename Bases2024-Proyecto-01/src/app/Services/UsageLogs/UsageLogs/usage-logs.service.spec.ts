import { TestBed } from '@angular/core/testing';

import { UsageLogsService } from './usage-logs.service';

describe('UsageLogsService', () => {
  let service: UsageLogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsageLogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
