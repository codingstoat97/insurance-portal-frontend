import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { catchError, EMPTY } from 'rxjs';

import { FormImportsModule } from '../form-imports.module';

import { HttpService } from 'src/app/core/services/http/http.service';
import { SnackBarService } from 'src/app/core/services/snack-bar/snack-bar.service';

import { ClientVehicle, Region, VehicleType } from '../../models';

import * as PATH from 'src/app/shared/utils/request-paths.util';

@Component({
  standalone: true,
  imports: [CommonModule, FormImportsModule, ReactiveFormsModule],
  selector: 'app-client-vehicle',
  templateUrl: './client-vehicle.component.html',
  styleUrls: ['./client-vehicle.component.sass']
})

export class ClientVehicleComponent implements OnInit {
  @Input() value?: ClientVehicle | null;
  @Input() title?: string | null = "Datos del Vehículo";
  @Input() submitLabel: string | null = 'Siguiente';
  @Input() showCancel = false;
  @Input() showDescription: boolean = false;

  @Output() submitted = new EventEmitter<ClientVehicle>();
  @Output() cancelled = new EventEmitter<void>();

  vehicleClassificationList: string[] = [];
  vehicleTypeList: VehicleType[] = [];
  regionalList: Region[] = [];
  description = "Cuéntanos sobre tu auto para encontrar la mejor cobertura."

  form = this.fb.group({
    brand: this.fb.control<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50)],
    }),
    model: this.fb.control<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50)],
    }),
    classification: this.fb.control<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    year: this.fb.control<number | null>(null, {
      validators: [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())],
    }),
    vehicleValue: this.fb.control<number | null>(null, {
      validators: [Validators.required, Validators.min(0)],
    }),
    regional: this.fb.control<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    level: this.fb.control<any>(null),
    franchise: this.fb.control<any>(null),
    vehicleType: this.fb.control<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor(private fb: FormBuilder, private httpService: HttpService, private snackbar: SnackBarService) { }

  ngOnInit(): void {
    if (this.value) {
      this.form.patchValue(this.value);
    }
    this.getVehiculeClassificationList();
    this.getVehicleTypeList();
    this.getRegionalList();
  }

  private getVehiculeClassificationList(): void {
    this.httpService.get<any>(PATH.vehicleClassificationList)
      .pipe(catchError(() => { this.snackbar.error('Error al cargar las clasificaciones de vehículo.'); return EMPTY; }))
      .subscribe(res => {
        this.vehicleClassificationList = this.normalizeClassifications(res);
        const v = this.value?.classification ?? null;
        if (v && !this.vehicleClassificationList.includes(v)) {
          this.vehicleClassificationList = [...this.vehicleClassificationList, v];
        }
      });
  }

  private normalizeClassifications(res: any): string[] {
    const arr = Array.isArray(res) ? res : [];
    const asStrings = arr.map((x: any) =>
      typeof x === 'string' ? x : (x?.value ?? x?.name ?? x?.id ?? '')
    );
    return [...new Set(asStrings.filter(Boolean))];
  }

  private getRegionalList(): void {
    this.httpService.get<any>(PATH.regionList)
      .pipe(catchError(() => { this.snackbar.error('Error al cargar las regionales.'); return EMPTY; }))
      .subscribe(res => { this.regionalList = res; });
  }

  private getVehicleTypeList(): void {
    this.httpService.get<VehicleType[]>(PATH.vehicleTypeList)
      .pipe(catchError(() => { this.snackbar.error('Error al cargar los tipos de motor.'); return EMPTY; }))
      .subscribe(res => { this.vehicleTypeList = res ?? []; });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload: ClientVehicle = {
      ...this.value,
      ...this.form.getRawValue(),
    } as ClientVehicle;

    this.submitted.emit(payload);
  }

  onCancel() {
    this.cancelled.emit();
  }

}
