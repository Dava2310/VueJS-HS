import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import type { ColumnDef } from '@tanstack/vue-table';
import DataTable from './DataTable.vue';

// ── Helpers ───────────────────────────────────────────────────────────────────

type Row = { name: string; email: string };

const columns: ColumnDef<Row>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
];

const data: Row[] = [
  { name: 'Alice', email: 'alice@example.com' },
  { name: 'Bob', email: 'bob@example.com' },
];

// ── DataTable ─────────────────────────────────────────────────────────────────

describe('DataTable', () => {
  it('renders column headers', () => {
    const wrapper = mount(DataTable, { props: { columns, data } });
    expect(wrapper.text()).toContain('Name');
    expect(wrapper.text()).toContain('Email');
  });

  it('renders a row for each data item', () => {
    const wrapper = mount(DataTable, { props: { columns, data } });
    expect(wrapper.text()).toContain('Alice');
    expect(wrapper.text()).toContain('Bob');
  });

  it('shows "No results." when data is empty', () => {
    const wrapper = mount(DataTable, { props: { columns, data: [] } });
    expect(wrapper.text()).toContain('No results.');
  });

  it('renders a filter input when filterColumns is provided', () => {
    const wrapper = mount(DataTable, { props: { columns, data, filterColumns: ['email'] } });
    expect(wrapper.find('input[placeholder="Filter email..."]').exists()).toBe(true);
  });

  it('does not render filter inputs when filterColumns is omitted', () => {
    const wrapper = mount(DataTable, { props: { columns, data } });
    expect(wrapper.find('input').exists()).toBe(false);
  });

  it('disables the Previous button on the first page', () => {
    const wrapper = mount(DataTable, { props: { columns, data } });
    const buttons = wrapper.findAll('button');
    const prev = buttons.find((b) => b.text() === 'Previous');
    expect(prev?.attributes('disabled')).toBeDefined();
  });
});
