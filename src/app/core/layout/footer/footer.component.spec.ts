import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { FooterComponent } from './footer.component';
import { ToolbarService } from '../../services/toolbar/toolbar.service';

const mockToolbarService = {
  variant$: of('solid' as const),
};

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [
        { provide: ToolbarService, useValue: mockToolbarService },
      ],
    });
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reflect variant from service', () => {
    expect(component.variant).toBe('solid');
  });

  it('should not apply is-home class when variant is solid', () => {
    const toolbar = fixture.nativeElement.querySelector('mat-toolbar');
    expect(toolbar.classList).not.toContain('is-home');
  });

  it('should apply is-home class when variant is transparent', () => {
    component.variant = 'transparent';
    fixture.detectChanges();
    const toolbar = fixture.nativeElement.querySelector('mat-toolbar');
    expect(toolbar.classList).toContain('is-home');
  });

  it('should unsubscribe on destroy', () => {
    const spy = spyOn((component as any).subscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});
