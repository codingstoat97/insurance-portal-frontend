import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';

import { ToolbarComponent } from './toolbar.component';
import { ToolbarService } from '../../services/toolbar/toolbar.service';
import { AuthService } from '../../services/auth/auth.service';
import { ResponsiveService } from '../../services/responsive/responsive.service';

const showNav$ = new BehaviorSubject(false);

const mockToolbarService = {
  variant$: of('solid' as const),
  showNav$: showNav$.asObservable(),
};

const mockAuthService = {
  getRedirectionPath: () => '/portal/dashboard',
};

const mockResponsiveService = {
  isPhonePortrait: false,
};

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;

  beforeEach(() => {
    showNav$.next(false);
    mockResponsiveService.isPhonePortrait = false;
    TestBed.configureTestingModule({
      imports: [ToolbarComponent, RouterTestingModule],
      providers: [
        { provide: ToolbarService, useValue: mockToolbarService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ResponsiveService, useValue: mockResponsiveService },
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

  it('should always render the mat-toolbar element', () => {
    expect(fixture.nativeElement.querySelector('mat-toolbar')).toBeTruthy();
  });

  describe('desktop (isPhonePortrait = false)', () => {
    beforeEach(() => {
      mockResponsiveService.isPhonePortrait = false;
      showNav$.next(true);
      fixture.detectChanges();
    });

    it('should show desktop nav links', () => {
      expect(fixture.nativeElement.querySelector('.right')).toBeTruthy();
    });

    it('should not show hamburger button', () => {
      expect(fixture.nativeElement.querySelector('.menu-btn')).toBeNull();
    });
  });

  describe('mobile (isPhonePortrait = true)', () => {
    beforeEach(() => {
      mockResponsiveService.isPhonePortrait = true;
      showNav$.next(true);
      fixture.detectChanges();
    });

    it('should show hamburger button', () => {
      expect(fixture.nativeElement.querySelector('.menu-btn')).toBeTruthy();
    });

    it('should not show desktop nav links', () => {
      expect(fixture.nativeElement.querySelector('.right')).toBeNull();
    });
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
