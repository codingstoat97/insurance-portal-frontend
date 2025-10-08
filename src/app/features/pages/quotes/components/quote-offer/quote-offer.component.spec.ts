import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteOfferComponent } from './quote-offer.component';

describe('QuoteOfferComponent', () => {
  let component: QuoteOfferComponent;
  let fixture: ComponentFixture<QuoteOfferComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [QuoteOfferComponent]
    });
    fixture = TestBed.createComponent(QuoteOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
