import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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

  regionalList: Region[] = [];
  description = "Cuéntanos sobre tu auto para encontrar la mejor cobertura."

  private brandListSubject = new BehaviorSubject<string[]>([]);
  private modelListSubject = new BehaviorSubject<string[]>([]);
  filteredBrandList$!: Observable<string[]>;
  filteredModelList$!: Observable<string[]>;

  form = this.fb.group({
    brand: this.fb.control<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50)],
    }),
    model: this.fb.control<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50)],
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

    const brandStable$ = brandControl.valueChanges.pipe(
      startWith(brandControl.value),
      debounceTime(300),
      distinctUntilChanged(),
    );

    // Only clear the model once the brand genuinely changes after the initial/prefilled value —
    // pairwise() skips the first emission, so patched edit values are left untouched.
    brandStable$.pipe(pairwise())
      .subscribe(() => modelControl.setValue('', { emitEvent: false }));

    brandStable$.pipe(
      switchMap(brand => brand
        ? this.httpService.get<string[]>(`${PATH.vehicleAllModelsByBrand}?brand=${encodeURIComponent(brand)}`)
          .pipe(catchError(() => of([])))
        : of([])),
    ).subscribe(models => this.modelListSubject.next(models ?? []));
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
