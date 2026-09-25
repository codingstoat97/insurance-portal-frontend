import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  BehaviorSubject, Observable, catchError, combineLatest, debounceTime,
  distinctUntilChanged, EMPTY, map, of, pairwise, startWith, switchMap,
} from 'rxjs';

import { FormImportsModule } from '../form-imports.module';

import { HttpService } from 'src/app/core/services/http/http.service';
import { SnackBarService } from 'src/app/core/services/snack-bar/snack-bar.service';

import { ClientVehicle, Region } from '../../models';

import * as PATH from 'src/app/shared/utils/request-paths.util';
import { formatThousands, parseThousands } from 'src/app/shared/utils/number-format.util';

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
  @Input() loading = false;

  @Output() submitted = new EventEmitter<ClientVehicle>();
  @Output() cancelled = new EventEmitter<void>();

  regionalList: Region[] = [];
  description = "Cuéntanos sobre tu auto para encontrar la mejor cobertura."

  private brandListSubject = new BehaviorSubject<string[]>([]);
  private modelListSubject = new BehaviorSubject<string[]>([]);
  filteredBrandList$!: Observable<string[]>;
  filteredModelList$!: Observable<string[]>;

  vehicleValueDisplay = '';

  form = this.fb.group({
    brand: this.fb.control<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50), this.inCatalog(() => this.brandListSubject.value)],
    }),
    model: this.fb.control<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50), this.inCatalog(() => this.modelListSubject.value)],
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
    franchise: this.fb.control<any>(null),
    clientName: this.fb.control<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
    clientEmail: this.fb.control<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    clientPhone: this.fb.control<number | null>(null, {
      validators: [Validators.required],
    }),
  });

  constructor(private fb: FormBuilder, private httpService: HttpService, private snackbar: SnackBarService) { }

  ngOnInit(): void {
    this.getRegionalList();
    this.getBrandList();
    this.setupBrandAndModelAutocomplete();

    if (this.value) {
      this.form.patchValue(this.value);
    }
    this.vehicleValueDisplay = formatThousands(this.form.controls.vehicleValue.value);
  }

  onVehicleValueInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const numericValue = parseThousands(input.value);
    this.form.controls.vehicleValue.setValue(numericValue);
    this.vehicleValueDisplay = formatThousands(numericValue);
  }

  private setupBrandAndModelAutocomplete(): void {
    const brandControl = this.form.controls.brand;
    const modelControl = this.form.controls.model;

    this.filteredBrandList$ = combineLatest([
      brandControl.valueChanges.pipe(startWith(brandControl.value)),
      this.brandListSubject,
    ]).pipe(map(([typed, list]) => this.filterOptions(list, typed)));

    this.filteredModelList$ = combineLatest([
      modelControl.valueChanges.pipe(startWith(modelControl.value)),
      this.modelListSubject,
    ]).pipe(map(([typed, list]) => this.filterOptions(list, typed)));

    this.brandListSubject.subscribe(() => brandControl.updateValueAndValidity({ emitEvent: false }));
    this.modelListSubject.subscribe(() => modelControl.updateValueAndValidity({ emitEvent: false }));

    const brandStable$ = brandControl.valueChanges.pipe(
      startWith(brandControl.value),
      debounceTime(300),
      map(brand => this.findInCatalog(this.brandListSubject.value, brand) ?? (brand ?? '').trim()),
      distinctUntilChanged(),
    );

    brandStable$.pipe(pairwise())
      .subscribe(() => modelControl.setValue('', { emitEvent: false }));

    brandStable$.pipe(
      switchMap(brand => brand
        ? this.httpService.get<string[]>(`${PATH.vehicleAllModelsByBrand}?brand=${encodeURIComponent(brand)}`)
          .pipe(catchError(() => of([])))
        : of([])),
    ).subscribe(models => this.modelListSubject.next(models ?? []));
  }

  snapToCatalog(field: 'brand' | 'model'): void {
    const control = this.form.controls[field];
    const list = field === 'brand' ? this.brandListSubject.value : this.modelListSubject.value;
    const match = this.findInCatalog(list, control.value);
    if (match && match !== control.value) {
      control.setValue(match);
    }
  }

  private findInCatalog(list: string[], typed: string | null): string | null {
    const value = (typed ?? '').trim().toLowerCase();
    if (!value) return null;
    return list.find(o => o.toLowerCase() === value) ?? null;
  }

  private inCatalog(getList: () => string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const list = getList();
      if (!control.value || !list.length) return null;
      return this.findInCatalog(list, control.value) ? null : { notInCatalog: true };
    };
  }

  private filterOptions(list: string[], typed: string | null): string[] {
    const filterValue = (typed ?? '').toLowerCase();
    if (!filterValue) return list;
    return list.filter(o => o.toLowerCase().includes(filterValue));
  }

  private getBrandList(): void {
    this.httpService.get<string[]>(PATH.vehicleAllBrands)
      .pipe(catchError(() => { this.snackbar.error('Error al cargar las marcas.'); return EMPTY; }))
      .subscribe(res => this.brandListSubject.next(res ?? []));
  }

  private getRegionalList(): void {
    this.httpService.get<any>(PATH.regionList)
      .pipe(catchError(() => { this.snackbar.error('Error al cargar las regionales.'); return EMPTY; }))
      .subscribe(res => { this.regionalList = res; });
  }

  onSubmit() {
    this.snapToCatalog('brand');
    this.snapToCatalog('model');
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
