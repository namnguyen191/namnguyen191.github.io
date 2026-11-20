import type { ReactElement } from 'react';

export type TableRowData = Record<string, unknown>;
export type TableData<T extends TableRowData> = T[];
export interface TableColumn<TRowData extends TableRowData, TKey extends keyof TRowData> {
  id: TKey;
  header: string;
  resizeable?: boolean;
  customCell?: (val: TRowData[TKey], rowIndex: number) => ReactElement;
}
export type TableColumns<T extends TableRowData> = {
  [K in keyof T]: TableColumn<T, K>;
}[keyof T][];
export const createTableColumns = <T extends TableRowData>(
  columns: TableColumns<T>
): TableColumns<T> => columns;
export interface TableModel<T extends TableRowData> {
  columns: TableColumns<T>;
}

export interface CarbonTableProps<T extends TableRowData> {
  tableModel: TableModel<T>;
  data: TableData<T>;
}
