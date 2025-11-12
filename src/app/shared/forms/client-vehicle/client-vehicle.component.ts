import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FormImportsModule } from '../form-imports.module';

import { HttpService } from 'src/app/core/services/http/http.service';

import { ClientVehicle, Region } from '../../models';

import * as PATH from 'src/app/shared/utils/request-paths.util';

@Component({
  standalone: true,
  imports: [CommonModule, FormImportsModule, ReactiveFormsModule],
  selector: 'app-client-vehicle',
  templateUrl: './client-vehicle.component.html',
  styleUrls: ['./client-vehicle.component.sass']
})

export class ClientVehicleComponent implements OnInit, OnDestroy {
  @Input() value?: ClientVehicle | null;
  @Input() title?: string | null = "Datos del Vehículo";
  @Input() submitLabel: string | null = 'Siguiente';
  @Input() showCancel = false;
  @Input() showDescription: boolean = false;

  @Output() submitted = new EventEmitter<ClientVehicle>();
  @Output() cancelled = new EventEmitter<void>();

  vehicleClassificationList: string[] = [];
  regionalList: Region[] = [];
  description = "Con esta información podremos mostrarte planes adaptados al modelo, año y características de tu vehículo. Así evitamos ofrecerte opciones que no se ajusten a lo que realmente necesitas."

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
  });

  constructor(private fb: FormBuilder, private httpService: HttpService) { }

  ngOnInit(): void {
    this.getVehiculeClassificationList();
    this.getRegionalList();
  }

  ngOnDestroy(): void { }

  private getVehiculeClassificationList(): void {
    this.httpService.get<any>(PATH.vehicleClassificationList).subscribe(res => {
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
    this.httpService.get<any>(PATH.regionList).subscribe(res => {
      this.regionalList = res;
    });
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
