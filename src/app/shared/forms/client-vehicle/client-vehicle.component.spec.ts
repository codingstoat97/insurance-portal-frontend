import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientVehicleComponent } from './client-vehicle.component';

describe('ClientVehicleComponent', () => {
  let component: ClientVehicleComponent;
  let fixture: ComponentFixture<ClientVehicleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientVehicleComponent]
    });
    fixture = TestBed.createComponent(ClientVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
