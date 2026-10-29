export type Column<T = any> = {
  id: string;
  header: string;
  field?: keyof T & string;
  valueGetter?: (row: T) => any;
  iconGetter?: (row: T) => { icon: string; color: string } | null;
  filterable?: boolean;
};

export type Action = {
  id: string;
  icon: string;
  tooltip: string;
};
// Resolves a column's display value; fractional numbers are shown with 2 decimals.
export function getCellValue<T>(col: Column<T>, row: T): any {
  const val = col.valueGetter ? col.valueGetter(row) : (row as any)[col.field || col.id];
  return typeof val === 'number' && !Number.isInteger(val) ? val.toFixed(2) : val;
}
