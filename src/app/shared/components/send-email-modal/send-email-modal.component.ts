import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { FormImportsModule } from '../../forms/form-imports.module';

@Component({
  selector: 'app-send-email-modal',
  standalone: true,
  imports: [CommonModule, FormImportsModule, MatDialogModule],
  templateUrl: './send-email-modal.component.html',
  styleUrls: ['./send-email-modal.component.sass']
})
export class SendEmailModalComponent {

  form = this.fb.group({
    email: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
  });

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<SendEmailModalComponent>) { }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.form.value.email);
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
