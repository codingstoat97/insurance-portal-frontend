import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared.module';

import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  element: string;
  type: string;
}

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [CommonModule, SharedModule, MatDialogModule],
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.sass']
})
export class DeleteModalComponent {
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DeleteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  closeModal(): void {
    this.dialogRef.close();
  }
}
