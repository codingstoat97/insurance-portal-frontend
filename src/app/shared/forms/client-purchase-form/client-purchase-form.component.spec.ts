import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPurchaseFormComponent } from './client-purchase-form.component';

describe('ClientPurchaseFormComponent', () => {
  let component: ClientPurchaseFormComponent;
  let fixture: ComponentFixture<ClientPurchaseFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClientPurchaseFormComponent]
    });
    fixture = TestBed.createComponent(ClientPurchaseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
