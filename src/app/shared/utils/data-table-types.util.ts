export type Column<T = any> = {
  id: string;
  header: string;
  field?: keyof T & string;
  valueGetter?: (row: T) => any;
};

export type Action = {
  id: string;
  icon: string;
  tooltip: string;
};