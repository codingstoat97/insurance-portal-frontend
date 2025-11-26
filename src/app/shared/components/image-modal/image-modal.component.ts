import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared.module';

import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  title: string,
  image: string;
}

@Component({
  selector: 'app-image-modal',
  standalone: true,
  imports: [CommonModule, SharedModule, MatDialogModule],
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.sass']
})
export class ImageModalComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ImageModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

    ngOnInit(): void {
      console.log(this.data);
      
    }

  closeModal(): void {
    this.dialogRef.close();
  }
}
