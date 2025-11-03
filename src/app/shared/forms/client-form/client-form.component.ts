import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Client, Region } from 'src/app/shared/models';

import { FormImportsModule } from '../form-imports.module';
import { HttpService } from 'src/app/core/services/http/http.service';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormImportsModule
  ],
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.sass']
})
export class ClientFormComponent implements OnInit, OnChanges, OnDestroy {

  @Input() value?: Client | null;
  @Input() title?: string | null = 'Tus Datos';
  @Input() submitLabel?: string | null = 'Siguiente';
  @Input() showCancel = false;
  @Input() showDescription: boolean = false;

  @Output() submitted = new EventEmitter<Client>();
  @Output() cancelled = new EventEmitter<void>();

  regionList: Region[] = [];
  description = "No compartiremos tu información con terceros — la usamos únicamente para ayudarte a encontrar el mejor seguro";

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    lastname: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    region: ['', [Validators.required]],
  });

  constructor(private fb: FormBuilder, private httpService: HttpService) { }

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
    const payload = this.form.value as Client;
    this.submitted.emit(payload);
  }

  private fetchRegionList(): void {
    this.httpService.get<any>('regionals').subscribe(res => {
      this.regionList = res;
    });
  }

  onCancel() {
    this.cancelled.emit();
  }

}
