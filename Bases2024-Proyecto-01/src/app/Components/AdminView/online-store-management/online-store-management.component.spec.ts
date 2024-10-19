import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineStoreManagementComponent } from './online-store-management.component';

describe('OnlineStoreManagementComponent', () => {
  let component: OnlineStoreManagementComponent;
  let fixture: ComponentFixture<OnlineStoreManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnlineStoreManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlineStoreManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
