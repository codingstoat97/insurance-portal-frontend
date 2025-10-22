import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerMainComponent } from './broker-main.component';

describe('BrokerMainComponent', () => {
  let component: BrokerMainComponent;
  let fixture: ComponentFixture<BrokerMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BrokerMainComponent]
    });
    fixture = TestBed.createComponent(BrokerMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
