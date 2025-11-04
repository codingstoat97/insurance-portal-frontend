import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

import { SharedModule } from '../../shared.module';

import { Region } from '../../models';
import { FormImportsModule } from '../form-imports.module';
import { HttpService } from 'src/app/core/services/http/http.service';
import { SnackBarService } from 'src/app/core/services/snack-bar/snack-bar.service';


@Component({
  selector: 'app-region-form',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    FormImportsModule,
    ReactiveFormsModule
  ],
  templateUrl: './region-form.component.html',
  styleUrls: ['./region-form.component.sass']
})
export class RegionFormComponent implements OnInit, OnChanges, OnDestroy {

  @Input() value?: Region | null;
  @Input() title?: string | null = 'Datos de la Región';
  @Input() submitLabel?: string | null = 'Guardar';
  @Input() showCancel = false;

  @Output() submitted = new EventEmitter<Region>();
  @Output() cancelled = new EventEmitter<void>();

  form = this.fb.group({
    name: [''],
    country: ['']
  });

  constructor(private fb: FormBuilder, private httpService: HttpService, private snackbar: SnackBarService) { }

  ngOnInit(): void {

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
    const payload = this.form.value as Region;
    this.submitted.emit(payload);
  }

  onCancel() {
    this.cancelled.emit();
  }

}
