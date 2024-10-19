import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDistributorComponent } from './edit-distributor.component';

describe('EditDistributorComponent', () => {
  let component: EditDistributorComponent;
  let fixture: ComponentFixture<EditDistributorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDistributorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDistributorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
