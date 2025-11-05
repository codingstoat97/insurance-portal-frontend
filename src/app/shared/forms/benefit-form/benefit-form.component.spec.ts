import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BenefitFormComponent } from './benefit-form.component';

describe('BenefitFormComponent', () => {
  let component: BenefitFormComponent;
  let fixture: ComponentFixture<BenefitFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BenefitFormComponent]
    });
    fixture = TestBed.createComponent(BenefitFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
