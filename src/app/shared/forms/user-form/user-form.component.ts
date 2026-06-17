import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { User, Region } from 'src/app/shared/models';

import { catchError, EMPTY } from 'rxjs';

import { FormImportsModule } from '../form-imports.module';
import { HttpService } from 'src/app/core/services/http/http.service';
import { SnackBarService } from 'src/app/core/services/snack-bar/snack-bar.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormImportsModule
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.sass']
})
export class UserFormComponent implements OnInit {

  @Input() value?: User | null;
  @Input() title?: string | null = 'Tus Datos';
  @Input() submitLabel?: string | null = 'Siguiente';
  @Input() showCancel = false;
  @Input() showDescription: boolean = false;

  @Output() submitted = new EventEmitter<User>();
  @Output() cancelled = new EventEmitter<void>();

  regionList: Region[] = [];
  description = "No compartiremos tu información con terceros — la usamos únicamente para ayudarte a encontrar el mejor seguro";

  form = this.fb.group({
    name: this.fb.control<string | null>(null, [Validators.required, Validators.minLength(2)]),
    ci: this.fb.control<string | null>(null, [Validators.required, Validators.minLength(2)]),
    email: this.fb.control<string | null>(null, [Validators.required, Validators.email]),
    password: this.fb.control<string | null>(null, [Validators.required, Validators.minLength(2)]),
  });

  constructor(private fb: FormBuilder, private httpService: HttpService, private snackbar: SnackBarService) { }

  ngOnInit(): void {
    this.fetchRegionList();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.value as User;
    this.submitted.emit(payload);
  }

  private fetchRegionList(): void {
    this.httpService.get<any>('regionals/list')
      .pipe(catchError(() => { this.snackbar.error('Error al cargar las regionales.'); return EMPTY; }))
      .subscribe(res => { this.regionList = res; });
  }

  onCancel() {
    this.cancelled.emit();
  }

}
