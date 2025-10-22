import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { Insurance, Region } from '../../models';

import { SharedModule } from '../../shared.module';
import { FormImportsModule } from '../form-imports.module';

import { HttpService } from 'src/app/core/services/http/http.service';
import { SnackBarService } from 'src/app/core/services/snack-bar/snack-bar.service';


@Component({
  selector: 'app-insurance-form',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    FormImportsModule,
    ReactiveFormsModule
  ],
  templateUrl: './insurance-form.component.html',
  styleUrls: ['./insurance-form.component.sass']
})
export class InsuranceFormComponent implements OnInit, OnChanges, OnDestroy {

  @Input() value?: Insurance | null;
  @Input() title?: string | null = 'Datos de la Aseguradora';
  @Input() submitLabel?: string | null = 'Guardar';
  @Input() showCancel = false;

  @Output() submitted = new EventEmitter<Insurance>();
  @Output() cancelled = new EventEmitter<void>();

  regionList: Region[] = [];

  form = this.fb.group({
    name: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required] }),
    type: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required] }),
    email: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    region: this.fb.control<Region | null>(null, { validators: [Validators.required] }),
  });

  constructor(private fb: FormBuilder, private httpService: HttpService, private snackbar: SnackBarService) { }

  ngOnInit(): void {
    this.fetchRegionList();
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnDestroy(): void {

  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.value as Insurance;
    this.saveInsuranceData(payload);
    this.submitted.emit(payload);
  }

  onCancel() {
    this.cancelled.emit();
  }

  private fetchRegionList(): void {
    this.httpService.get<Region[]>('regionals').subscribe(res => {
      console.log(res);

      this.regionList = res;
    });
  }

  private saveInsuranceData(body: Insurance): void {
    this.httpService.post<Insurance>('insurances', body).subscribe(res => {
      console.log(res);
      this.snackbar.success('Guardado con éxito');
    });
  }

}
