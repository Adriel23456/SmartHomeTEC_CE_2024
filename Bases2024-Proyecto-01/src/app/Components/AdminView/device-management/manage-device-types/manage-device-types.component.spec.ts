import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDeviceTypesComponent } from './manage-device-types.component';

describe('ManageDeviceTypesComponent', () => {
  let component: ManageDeviceTypesComponent;
  let fixture: ComponentFixture<ManageDeviceTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageDeviceTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageDeviceTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
