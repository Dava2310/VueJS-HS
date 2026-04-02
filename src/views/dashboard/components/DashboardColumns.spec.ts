import { describe, it, expect } from 'vitest';
import type { VNode } from 'vue';
import { dashboardColumns } from './DashboardColumns';
import type { AssetVM } from '@/views/assets/composables/useAsset';

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeAsset(overrides: Partial<AssetVM> = {}): AssetVM {
  return {
    id: '1',
    name: 'ThinkPad X1',
    sku: 'TP-X1-001',
    description: 'Business ultrabook',
    model: 'X1 Carbon',
    brand: 'Lenovo',
    categoryId: '1',
    categoryName: 'Laptops',
    employeeId: '2',
    employeeName: 'Jane Doe',
    createdAt: '2025-01-01T00:00:00.000Z',
    status: 'Active',
    ...overrides,
  };
}

function columnById(id: string) {
  return dashboardColumns.find(
    (c) => ('id' in c ? c.id : 'accessorKey' in c ? c.accessorKey : undefined) === id,
  );
}

function cellOutput(columnId: string, asset: AssetVM): unknown {
  const col = columnById(columnId);
  if (!col || !('cell' in col) || typeof col.cell !== 'function') return undefined;
  return col.cell({ row: { original: asset } } as never);
}

function slotChildren(columnId: string, asset: AssetVM): unknown[] {
  const vnode = cellOutput(columnId, asset) as VNode;
  const slots = vnode.children as { default: () => unknown[] };
  return slots.default();
}

// ── Column definitions ────────────────────────────────────────────────────────

describe('dashboardColumns', () => {
  it('defines 6 columns', () => {
    expect(dashboardColumns).toHaveLength(6);
  });

  describe('model column', () => {
    it('combines brand and model into a single string', () => {
      const vnode = cellOutput('model', makeAsset({ brand: 'Lenovo', model: 'X1 Carbon' }));
      expect(JSON.stringify(vnode)).toContain('Lenovo X1 Carbon');
    });
  });

  describe('status column', () => {
    it('shows "Available" when employeeName is empty or "None"', () => {
      expect(slotChildren('status', makeAsset({ employeeName: '' }))).toContain('Available');
      expect(slotChildren('status', makeAsset({ employeeName: 'None' }))).toContain('Available');
    });

    it('shows "In Use" when the asset has an assigned employee', () => {
      expect(slotChildren('status', makeAsset({ employeeName: 'Jane Doe' }))).toContain('In Use');
    });
  });

  describe('custodian column', () => {
    it('returns "—" when employeeName is empty or "None"', () => {
      expect(cellOutput('employeeName', makeAsset({ employeeName: '' }))).toBe('—');
      expect(cellOutput('employeeName', makeAsset({ employeeName: 'None' }))).toBe('—');
    });

    it('returns the employee name when assigned', () => {
      expect(cellOutput('employeeName', makeAsset({ employeeName: 'Jane Doe' }))).toBe('Jane Doe');
    });
  });
});
