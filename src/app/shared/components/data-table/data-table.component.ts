import { AfterViewInit, Component, EventEmitter, Input, Output, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared.module';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';


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
  @Input() columns: any[] = [];
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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
    }
    if (changes['rows']) {
      this.dataSource.data = this.rows || [];
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onAction(a: any, row: any, ev?: MouseEvent) {
    ev?.stopPropagation();
    this.action.emit({ actionId: a.id, row });
  }

  onAddNewElement() {
    this.addNewElementAction.emit();
  }

}

