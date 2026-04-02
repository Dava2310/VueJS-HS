import type { AssetCreationTimeSeriesPointDto } from '@/api-client';

export type TimeSeriesRange = '3m' | '6m' | 'year';

export function formatDisponibility(value: number): string {
  return Number.isInteger(value) ? `${value}%` : `${value.toFixed(1)}%`;
}

export function monthIndexFromName(monthName: string): number {
  const t = Date.parse(`${monthName} 1, 2000`);
  if (Number.isNaN(t)) return 12;
  return new Date(t).getMonth();
}

export function sortByCalendarMonth(
  points: AssetCreationTimeSeriesPointDto[],
): AssetCreationTimeSeriesPointDto[] {
  return [...points].sort((a, b) => monthIndexFromName(a.month) - monthIndexFromName(b.month));
}

export function filterPointsByRange(
  points: AssetCreationTimeSeriesPointDto[],
  range: TimeSeriesRange,
  year: number,
): AssetCreationTimeSeriesPointDto[] {
  const sorted = sortByCalendarMonth(points);
  if (range === 'year') return sorted;

  const n = range === '3m' ? 3 : 6;
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  if (year === currentYear) {
    const startMonth = Math.max(0, currentMonth - (n - 1));
    return sorted.filter((p) => {
      const m = monthIndexFromName(p.month);
      return m >= startMonth && m <= currentMonth;
    });
  }

  if (year < currentYear) {
    const startMonth = 12 - n;
    return sorted.filter((p) => monthIndexFromName(p.month) >= startMonth);
  }

  return [];
}
