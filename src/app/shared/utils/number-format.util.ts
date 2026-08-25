export function formatThousands(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) return '';
  return new Intl.NumberFormat('es-BO').format(value);
}

export function parseThousands(value: string | null | undefined): number | null {
  if (!value) return null;
  const digitsOnly = value.replace(/\D/g, '');
  return digitsOnly ? Number(digitsOnly) : null;
}
