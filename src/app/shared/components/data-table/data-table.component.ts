import { AfterViewInit, Component, EventEmitter, Input, Output, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared.module';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Column } from 'src/app/shared/utils/data-table-types.util';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatInputModule,
    MatTooltipModule,
    MatFormFieldModule
  ],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.sass']
})
export class DataTableComponent implements AfterViewInit {
  @Input() rows: any[] = [];
  @Input() columns: Column[] = [];
  @Input() actions: any[] = [];
  @Input() title: string = '';
  @Input() addElement: boolean = false;

  @Output() addNewElementAction = new EventEmitter<void>();
  @Output() action = new EventEmitter<{ actionId: string; row: any }>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>([]);

  constructor() {
    this.dataSource = new MatTableDataSource(this.rows);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.setupSortingAccessor();
    this.setupFilterPredicate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns']) {
      this.displayedColumns = (this.columns || []).map(c => c.id);
    }
    if (changes['rows']) {
      this.dataSource.data = this.rows || [];
    }
    if (changes['columns'] || changes['actions']) {
      const base = (this.columns || []).map(c => c.id);
      this.displayedColumns = (this.actions && this.actions.length)
        ? [...base, 'actions']
        : base;
      this.setupSortingAccessor();
      this.setupFilterPredicate();
    }
    if (changes['rows']) {
      this.dataSource.data = this.rows || [];
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onAction(a: any, row: any, ev?: MouseEvent): void {
    ev?.stopPropagation();
    this.action.emit({ actionId: a.id, row });
  }

  onAddNewElement(): void {
    this.addNewElementAction.emit();
  }

  private readCellValue(row: any, colId: string): unknown {
    const col = this.columns.find(c => c.id === colId);
    if (!col) return row[colId];
    const val = col.valueGetter ? col.valueGetter(row) : row[col.field || col.id];
    return val;
  }

  private normalize(val: unknown): string | number {
    if (val == null) return '';
    return typeof val === 'string' ? val.toLowerCase() : (val as any);
  }

  private setupSortingAccessor(): void {
    this.dataSource.sortingDataAccessor = (row, sortHeaderId) => {
      const value = this.readCellValue(row, sortHeaderId);
      return this.normalize(value);
    };
    this.dataSource.sort = this.sort;
  }

  private setupFilterPredicate(): void {
    this.dataSource.filterPredicate = (row, filter) => {
      const term = filter.trim().toLowerCase();
      if (!term) return true;

      // Solo columnas visibles (sin 'actions')
      for (const col of this.columns) {
        const raw = this.readCellValue(row, col.id);
        const text = (raw == null) ? '' : String(raw).toLowerCase();
        if (text.includes(term)) return true;
      }
      return false;
    };
  }

}

