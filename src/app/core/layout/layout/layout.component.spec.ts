import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';

import { LayoutComponent } from './layout.component';
import { ToolbarService } from '../../services/toolbar/toolbar.service';
import { AuthService } from '../../services/auth/auth.service';

const toolbarVisible$ = new BehaviorSubject(true);
const footerVisible$ = new BehaviorSubject(true);

const mockToolbarService = {
  isVisible$: toolbarVisible$.asObservable(),
  isFooterVisible$: footerVisible$.asObservable(),
  variant$: of('solid' as const),
  showNav$: of(false),
};

const mockAuthService = {
  getRedirectionPath: () => '/portal/dashboard',
};

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(() => {
    toolbarVisible$.next(true);
    footerVisible$.next(true);
    TestBed.configureTestingModule({
      imports: [LayoutComponent, RouterTestingModule],
      providers: [
        { provide: ToolbarService, useValue: mockToolbarService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    });
    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show toolbar and footer by default', () => {
    expect(component.toolbarVisible).toBeTrue();
    expect(component.footerVisible).toBeTrue();
  });

  it('should mount toolbar when toolbarVisible is true', () => {
    const toolbar = fixture.nativeElement.querySelector('app-toolbar');
    expect(toolbar).toBeTruthy();
  });

  it('should unmount toolbar when service emits false', () => {
    toolbarVisible$.next(false);
    fixture.detectChanges();
    expect(component.toolbarVisible).toBeFalse();
    expect(fixture.nativeElement.querySelector('app-toolbar')).toBeNull();
  });

  it('should apply no-toolbar class to main when toolbar is hidden', () => {
    toolbarVisible$.next(false);
    fixture.detectChanges();
    const main = fixture.nativeElement.querySelector('main');
    expect(main.classList).toContain('no-toolbar');
  });

  it('should mount footer when footerVisible is true', () => {
    const footer = fixture.nativeElement.querySelector('app-footer');
    expect(footer).toBeTruthy();
  });

  it('should unmount footer when service emits false', () => {
    footerVisible$.next(false);
    fixture.detectChanges();
    expect(component.footerVisible).toBeFalse();
    expect(fixture.nativeElement.querySelector('app-footer')).toBeNull();
  });

  it('should apply no-footer class to main when footer is hidden', () => {
    footerVisible$.next(false);
    fixture.detectChanges();
    const main = fixture.nativeElement.querySelector('main');
    expect(main.classList).toContain('no-footer');
  });

  it('should unsubscribe on destroy', () => {
    const spy = spyOn((component as any).subscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});
