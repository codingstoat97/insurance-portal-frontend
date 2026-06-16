import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ToolbarComponent } from './toolbar.component';
import { ToolbarService } from '../../services/toolbar/toolbar.service';
import { AuthService } from '../../services/auth/auth.service';

const mockToolbarService = {
  variant$: of('solid' as const),
  showNav$: of(false),
};

const mockAuthService = {
  getRedirectionPath: () => '/portal/dashboard',
};

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ToolbarComponent, RouterTestingModule],
      providers: [
        { provide: ToolbarService, useValue: mockToolbarService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    });
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reflect variant from the service', () => {
    expect(component.variant).toBe('solid');
  });

  it('should hide nav links when showNav is false', () => {
    expect(component.showNav).toBeFalse();
    const nav = fixture.nativeElement.querySelector('.right');
    expect(nav).toBeNull();
  });

  it('should always render the mat-toolbar element', () => {
    const toolbar = fixture.nativeElement.querySelector('mat-toolbar');
    expect(toolbar).toBeTruthy();
  });

  it('should navigate to portal on redirectToPortal()', () => {
    spyOn(component['router'], 'navigate');
    component.redirectToPortal();
    expect(component['router'].navigate).toHaveBeenCalledWith(['/portal/dashboard']);
  });

  it('should unsubscribe on destroy', () => {
    const spy = spyOn((component as any).subscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});
