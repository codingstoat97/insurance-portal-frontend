import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { MatDividerModule } from '@angular/material/divider';

import { SharedModule } from '../../shared.module';

export interface DialogData {
  title: string;
  columns: any[];
  element: any;
}

@Component({
  selector: 'app-info-modal',
  standalone: true,
  imports: [CommonModule, SharedModule, MatDialogModule, MatDividerModule],
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.sass']
})
export class InfoModalComponent {
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<InfoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  closeModal(): void {
    this.dialogRef.close();
  }
}
