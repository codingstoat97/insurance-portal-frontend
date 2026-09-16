import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared.module';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBottomSheet, MatBottomSheetModule, MatBottomSheetRef } from '@angular/material/bottom-sheet';

import { Column } from 'src/app/shared/utils/data-table-types.util';
import { ResponsiveService } from 'src/app/core/services/responsive/responsive.service';
import { DataCardListComponent } from 'src/app/shared/components/data-card-list/data-card-list.component';

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
    MatFormFieldModule,
    MatBottomSheetModule,
    DataCardListComponent
  ],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.sass']
})
export class DataTableComponent implements AfterViewInit, OnDestroy {
  @Input() rows: any[] = [];
  @Input() columns: Column[] = [];
  @Input() actions: any[] = [];
  @Input() title: string = '';
  @Input() addElement: boolean = false;
  /** When true, replaces the single global filter with one filter input per column. */
  @Input() columnFilters: boolean = false;

  @Output() addNewElementAction = new EventEmitter<void>();
  @Output() action = new EventEmitter<{ actionId: string; row: any }>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filterSheet') filterSheetTemplate!: TemplateRef<unknown>;

  private filterSheetRef?: MatBottomSheetRef<unknown>;

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>([]);

  /** Active per-column filter terms, keyed by column id. */
  columnFilterValues: Record<string, string> = {};

  get filterableColumns(): Column[] {
    return (this.columns || []).filter(c => {
      if (c.filterable === false) return false;
      if (c.filterable === true) return true;
      // `id` columns are not useful to filter by default; opt in with `filterable: true`.
      return c.id !== 'id';
    });
  }

  get hasActiveColumnFilters(): boolean {
    return Object.values(this.columnFilterValues).some(v => (v ?? '').trim() !== '');
  }

  get activeColumnFilterCount(): number {
    return Object.values(this.columnFilterValues).filter(v => (v ?? '').trim() !== '').length;
  }

  get isMobile(): boolean {
    return this.responsiveService.isPhonePortrait;
  }

  constructor(private responsiveService: ResponsiveService, private bottomSheet: MatBottomSheet) {
    this.dataSource = new MatTableDataSource(this.rows);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.setupSortingAccessor();
    this.setupFilterPredicate();
  }

  ngOnDestroy(): void {
    this.filterSheetRef?.dismiss();
    this.dataSource.sortingDataAccessor = null!;
    this.dataSource.filterPredicate = null!;
    this.dataSource.data = [];
    this.dataSource.disconnect();
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

  applyColumnFilter(colId: string, event: Event): void {
    this.columnFilterValues[colId] = (event.target as HTMLInputElement).value;
    this.triggerColumnFilter();
  }

  clearColumnFilter(colId: string): void {
    delete this.columnFilterValues[colId];
    this.triggerColumnFilter();
  }

  clearAllColumnFilters(): void {
    this.columnFilterValues = {};
    this.triggerColumnFilter();
  }

  openFilterSheet(): void {
    this.filterSheetRef = this.bottomSheet.open(this.filterSheetTemplate, {
      panelClass: 'data-table-filter-sheet'
    });
  }

  closeFilterSheet(): void {
    this.filterSheetRef?.dismiss();
  }

  private triggerColumnFilter(): void {
    const active = Object.entries(this.columnFilterValues)
      .filter(([, v]) => (v ?? '').trim() !== '');
    // MatTableDataSource only filters when `filter` is a non-empty string.
    this.dataSource.filter = active.length ? JSON.stringify(Object.fromEntries(active)) : '';

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
    if (typeof val === 'string') {
      const num = Number(val);
      return val.trim() !== '' && !isNaN(num) ? num : val.toLowerCase();
    }
    return val as any;
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
      const raw = (filter ?? '').trim();
      if (!raw) return true;

      if (this.columnFilters) {
        let terms: Record<string, string>;
        try {
          terms = JSON.parse(raw);
        } catch {
          return true;
        }
        // AND across columns: every active column term must match.
        return Object.entries(terms).every(([colId, term]) => {
          const t = String(term ?? '').trim().toLowerCase();
          if (!t) return true;
          const cell = this.readCellValue(row, colId);
          const text = (cell == null) ? '' : String(cell).toLowerCase();
          return text.includes(t);
        });
      }

      const term = raw.toLowerCase();
      // Solo columnas visibles (sin 'actions')
      for (const col of this.columns) {
        const cellValue = this.readCellValue(row, col.id);
        const text = (cellValue == null) ? '' : String(cellValue).toLowerCase();
        if (text.includes(term)) return true;
      }
      return false;
    };
  }

}

