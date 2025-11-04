export function generateFileName(baseName: string, extension: string): string {
  const currentDate = new Date().toISOString().split('T')[0];
  return `${baseName}_${currentDate}_${Math.random().toString(36).substring(2, 15)}.${extension}`;
}