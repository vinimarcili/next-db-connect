export type ColumnType = 'string' | 'number' | 'date' | 'boolean' | 'custom';

export interface CSVColumnConfig<T> {
  header: string;
  key?: keyof T;
  type?: ColumnType;
  formatter?: (value: unknown, row: T) => string;
}
