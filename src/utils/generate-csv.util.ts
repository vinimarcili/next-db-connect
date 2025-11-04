import { CSVColumnConfig, ColumnType } from "@/interfaces/csv.interface";
import { formatDate } from "./format-date.util";

const DEFAULT_SEPARATOR = ';';

export function generateCSV<T>(
  data: T[],
  columns: CSVColumnConfig<T>[]
): string {
  const headers = columns.map(col => col.header);
  const csvRows = [headers.join(DEFAULT_SEPARATOR)];

  data.forEach(row => {
    const csvRow = columns.map(column => {
      let value: string;

      if (column.formatter) {
        value = column.formatter(column.key ? row[column.key] : undefined, row);
      }
      else if (column.key) {
        const rawValue = row[column.key];
        value = formatValueByType(rawValue, column.type || 'string');
      }
      else {
        value = '';
      }

      return formatCSVCell(value);
    });

    csvRows.push(csvRow.join(DEFAULT_SEPARATOR));
  });

  const csvContent = csvRows.join('\n');

  return '\uFEFF' + csvContent;
}

function formatValueByType(value: unknown, type: ColumnType): string {
  if (value === null || value === undefined) return '';

  switch (type) {
    case 'date':
      return formatDate(value);
    case 'number':
      return typeof value === 'number' ? value.toString() : String(value);
    case 'boolean':
      return Boolean(value) ? 'Sim' : 'Não';
    case 'string':
    default:
      return String(value);
  }
}

function formatCSVCell(value: string): string {
  if (!value) return '""';

  let formattedValue = value;

  if (value.includes('"')) {
    formattedValue = value.replace(/"/g, '""');
  }

  const needsQuotes = value.includes(DEFAULT_SEPARATOR) ||
    value.includes(';') ||
    value.includes('\n') ||
    value.includes('\r') ||
    value.includes('"');

  return needsQuotes ? `"${formattedValue}"` : formattedValue;
}