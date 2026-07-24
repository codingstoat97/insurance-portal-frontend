import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

import { BrokerMainComponent } from './broker-main.component';
import { HttpService } from 'src/app/core/services/http/http.service';
import { SnackBarService } from 'src/app/core/services/snack-bar/snack-bar.service';
import { CoverageLabelPipe } from 'src/app/shared/pipes/coverage-pipe/coverage-label.pipe';

const mockHttpService = {
  get: () => of([]),
  post: () => of({}),
  put: () => of({}),
  delete: () => of({}),
};

const mockSnackBar = {
  success: jasmine.createSpy('success'),
  error: jasmine.createSpy('error'),
};

const mockDialogRef = {
  componentInstance: { submitted: of(null), cancelled: of(null) },
  afterClosed: () => of(undefined),
} as unknown as MatDialogRef<any>;

const mockDialog = {
  open: jasmine.createSpy('open').and.returnValue(mockDialogRef),
};

describe('BrokerMainComponent', () => {
  let component: BrokerMainComponent;
  let fixture: ComponentFixture<BrokerMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BrokerMainComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: HttpService, useValue: mockHttpService },
        { provide: SnackBarService, useValue: mockSnackBar },
        { provide: MatDialog, useValue: mockDialog },
        CoverageLabelPipe,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BrokerMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load lookup maps and plans on init', () => {
    expect(component.planRows).toEqual([]);
    expect(component.benefitRows).toEqual([]);
  });

  it('should use Action type for planActions and actions', () => {
    expect(component.planActions[0]).toEqual({ id: 'info', icon: 'info', tooltip: 'Detalles' });
    expect(component.actions[2]).toEqual({ id: 'delete', icon: 'delete', tooltip: 'Eliminar' });
  });

  it('should throw for unknown type in getDialogRef', () => {
    expect(() => (component as any).getDialogRef('Unknown')).toThrowError('Unknown entity type: Unknown');
  });

  it('should not crash openDeleteDialog when dialog is cancelled', () => {
    expect(() => component.openDeleteDialog('Plan', 'Plan 1', { id: '1' })).not.toThrow();
  });

  it('should call httpService.put in updateEntity', () => {
    const putSpy = spyOn(mockHttpService, 'put').and.returnValue(of({}));
    (component as any).updateEntity('Plan', { id: '1' });
    expect(putSpy).toHaveBeenCalled();
  });
});
