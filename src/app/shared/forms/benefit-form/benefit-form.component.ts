import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { FormImportsModule } from '../form-imports.module';
import { SharedModule } from '../../shared.module';

import { HttpService } from 'src/app/core/services/http/http.service';

import { Benefit } from '../../models';
import * as PATHS from 'src/app/shared/utils/request-paths.util'

@Component({
  selector: 'app-benefit-form',
  standalone: true,
  imports: [CommonModule, FormImportsModule, SharedModule, ReactiveFormsModule],
  templateUrl: './benefit-form.component.html',
  styleUrls: ['./benefit-form.component.sass']
})
export class BenefitFormComponent {

  @Input() value?: Benefit | null;
  @Input() title?: string | null = 'Crear Beneficio';
  @Input() submitLabel?: string | null = 'Guardar';
  @Input() showCancel = false;

  @Output() submitted = new EventEmitter<Benefit>();
  @Output() cancelled = new EventEmitter<void>();

  coverageTypeList: string[] = [];

  form = this.fb.group({
    name: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(80)] }),
    description: this.fb.control<string>('', { nonNullable: true, validators: [Validators.maxLength(500)] }),
    coverage: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(80)] }),
  });

  constructor(private fb: FormBuilder, private httpService: HttpService) { }

  ngOnInit(): void {
    this.getCoverageTypeList();
    this.applyValueToForm(this.value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('value' in changes) {
      this.applyValueToForm(changes['value'].currentValue);
    }
  }

  ngOnDestroy(): void {

  }

  private getCoverageTypeList(): void {
    this.httpService.get<any>(PATHS.benefitGetCoverageTypeList).subscribe(res => {
      this.coverageTypeList = this.normalizeList(res);
      const v = this.value?.coverage ?? null;
      if (v && !this.coverageTypeList.includes(v)) {
        this.coverageTypeList = [...this.coverageTypeList, v];
      }
      if (this.value) this.applyValueToForm(this.value);
    });
  }

  private normalizeList(res: any): string[] {
    const arr = Array.isArray(res) ? res : [];
    const asStrings = arr.map((x: any) =>
      typeof x === 'string' ? x : (x?.value ?? x?.name ?? x?.id ?? '')
    );
    return [...new Set(asStrings.filter(Boolean))];
  }

  private applyValueToForm(v: Benefit | null | undefined) {
    if (v) {
      this.form.reset(
        {
          name: v.name ?? '',
          description: v.description ?? '',
          coverage: v.coverage ?? '',
        },
        { emitEvent: false }
      );
      this.form.markAsPristine();
      this.form.markAsUntouched();
    } else {
      this.form.reset({ name: '', description: '', coverage: '' }, { emitEvent: false });
      this.form.markAsPristine();
      this.form.markAsUntouched();
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload: Benefit = {
      ...this.value,
      ...this.form.value,
    } as Benefit;

    this.submitted.emit(payload);
  }

  onCancel() {
    this.cancelled.emit();
  }

}
