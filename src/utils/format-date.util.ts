export function formatDate(date: Date | string | unknown): string {
  if (!date) return '';

  if (date instanceof Date) {
    return date.toISOString().split('T')[0];
  }

  if (typeof date === 'string') {
    const dateObj = new Date(date);
    if (!isNaN(dateObj.getTime())) {
      return dateObj.toISOString().split('T')[0];
    }
  }

  return String(date).split('T')[0] || '';
}