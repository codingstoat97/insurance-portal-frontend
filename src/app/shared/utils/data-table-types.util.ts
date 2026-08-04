export type Column<T = any> = {
  id: string;
  header: string;
  field?: keyof T & string;
  valueGetter?: (row: T) => any;
  iconGetter?: (row: T) => { icon: string; color: string } | null;
};

export type Action = {
  id: string;
  icon: string;
  tooltip: string;
};