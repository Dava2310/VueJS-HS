import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  formatDisponibility,
  monthIndexFromName,
  sortByCalendarMonth,
  filterPointsByRange,
} from './dashboardUtils';
import type { AssetCreationTimeSeriesPointDto } from '@/api-client';

// ── Helpers ──────────────────────────────────────────────────────────────────

function point(month: string, total = 0): AssetCreationTimeSeriesPointDto {
  return { month, total };
}

const FULL_YEAR = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
].map((m) => point(m));

// ── formatDisponibility ───────────────────────────────────────────────────────

describe('formatDisponibility', () => {
  it('formats an integer as a whole-number percentage', () => {
    expect(formatDisponibility(25)).toBe('25%');
  });

  it('formats a float to one decimal place', () => {
    expect(formatDisponibility(33.333)).toBe('33.3%');
  });

  it('formats zero as 0%', () => {
    expect(formatDisponibility(0)).toBe('0%');
  });

  it('formats a value that is already one decimal place without adding extra decimals', () => {
    expect(formatDisponibility(12.5)).toBe('12.5%');
  });
});

// ── monthIndexFromName ────────────────────────────────────────────────────────

describe('monthIndexFromName', () => {
  it('returns 0 for January', () => expect(monthIndexFromName('January')).toBe(0));
  it('returns 11 for December', () => expect(monthIndexFromName('December')).toBe(11));
  it('returns 12 for an unrecognised string', () =>
    expect(monthIndexFromName('not-a-month')).toBe(12));
});

// ── sortByCalendarMonth ───────────────────────────────────────────────────────

describe('sortByCalendarMonth', () => {
  it('sorts an unordered list into calendar order', () => {
    const input = [point('March'), point('January'), point('February')];
    const sorted = sortByCalendarMonth(input);
    expect(sorted.map((p) => p.month)).toEqual(['January', 'February', 'March']);
  });

  it('does not mutate the original array', () => {
    const input = [point('June'), point('April')];
    sortByCalendarMonth(input);
    expect(input[0].month).toBe('June');
  });

  it('returns an empty array unchanged', () => {
    expect(sortByCalendarMonth([])).toEqual([]);
  });
});

// ── filterPointsByRange ───────────────────────────────────────────────────────

describe('filterPointsByRange', () => {
  afterEach(() => vi.useRealTimers());

  describe('"year" range', () => {
    it('returns all 12 months sorted', () => {
      const shuffled = [...FULL_YEAR].reverse();
      const result = filterPointsByRange(shuffled, 'year', 2024);
      expect(result).toHaveLength(12);
      expect(result[0].month).toBe('January');
      expect(result[11].month).toBe('December');
    });
  });

  describe('past year', () => {
    it('"3m" returns the last 3 months of the year', () => {
      const result = filterPointsByRange(FULL_YEAR, '3m', 2023);
      expect(result.map((p) => p.month)).toEqual(['October', 'November', 'December']);
    });
  });

  describe('current year', () => {
    it('"3m" returns the 3 months up to and including the current month', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-04-03'));

      const result = filterPointsByRange(FULL_YEAR, '3m', 2026);
      expect(result.map((p) => p.month)).toEqual(['February', 'March', 'April']);
    });

    it('"6m" clamps to available months when fewer than 6 have elapsed', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-04-03'));

      const result = filterPointsByRange(FULL_YEAR, '6m', 2026);
      expect(result.map((p) => p.month)).toEqual(['January', 'February', 'March', 'April']);
    });
  });

  describe('future year', () => {
    it('returns an empty array for a year in the future', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-04-03'));

      const result = filterPointsByRange(FULL_YEAR, '3m', 2027);
      expect(result).toEqual([]);
    });
  });
});
