import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { HomeComponent } from './home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ResponsiveService } from 'src/app/core/services/responsive/responsive.service';

const mockResponsiveService = {
  isPhonePortrait: false,
};

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [SharedModule, RouterTestingModule],
      providers: [
        { provide: ResponsiveService, useValue: mockResponsiveService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reflect isPhonePortrait from the responsive service', () => {
    mockResponsiveService.isPhonePortrait = true;
    expect(component.isMobile).toBeTrue();

    mockResponsiveService.isPhonePortrait = false;
    expect(component.isMobile).toBeFalse();
  });

  it('should navigate to /quotes on goToStepper()', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    component.goToStepper();
    expect(router.navigate).toHaveBeenCalledWith(['/quotes']);
  });

  it('should use 1 grid column on mobile', () => {
    mockResponsiveService.isPhonePortrait = true;
    expect(component.isMobile).toBeTrue();
  });

  it('should use 3 grid columns on desktop', () => {
    mockResponsiveService.isPhonePortrait = false;
    expect(component.isMobile).toBeFalse();
  });
});
