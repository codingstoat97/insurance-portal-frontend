import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { MatDividerModule } from '@angular/material/divider';

import { SharedModule } from '../../shared.module';

export interface InfoImage {
  label: string;
  src?: string | null;
}

export interface DialogData {
  title: string;
  columns: any[];
  element: any;
  images?: InfoImage[];
}

@Component({
  selector: 'app-info-modal',
  standalone: true,
  imports: [CommonModule, SharedModule, MatDialogModule, MatDividerModule],
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.sass']
})
export class InfoModalComponent {
  selectedImage: InfoImage | null = null;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<InfoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  closeModal(): void {
    this.dialogRef.close();
  }

  getValue(col: any): any {
    return col.valueGetter ? col.valueGetter(this.data.element) : this.data.element[col.field ?? col.id];
  }
}
