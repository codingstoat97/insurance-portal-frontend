import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Column } from 'src/app/shared/utils/data-table-types.util';

@Component({
  selector: 'app-data-card-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './data-card-list.component.html',
  styleUrls: ['./data-card-list.component.sass']
})
export class DataCardListComponent {
  @Input() rows: any[] = [];
  @Input() columns: Column[] = [];
  @Input() actions: any[] = [];

  @Output() action = new EventEmitter<{ actionId: string; row: any }>();

  getValue(col: Column, row: any): unknown {
    return col.valueGetter ? col.valueGetter(row) : row[col.field || col.id];
  }

  onAction(a: any, row: any, ev?: MouseEvent): void {
    ev?.stopPropagation();
    this.action.emit({ actionId: a.id, row });
  }
}