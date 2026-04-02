import { h } from 'vue';
import { type ColumnDef } from '@tanstack/vue-table';
import { ArrowUpDown } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import type { AssetVM } from '../composables/useAsset';
import AssetRowActions from './AssetRowActions.vue';

export const columns: ColumnDef<AssetVM>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'sku',
    header: 'SKU',
  },
  {
    accessorKey: 'name',
    header: ({ column }) =>
      h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['Name', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
      ),
  },
  {
    accessorKey: 'brand',
    header: 'Brand',
  },
  {
    accessorKey: 'model',
    header: 'Model',
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) =>
      h(
        'span',
        { class: 'block max-w-[220px] truncate', title: row.original.description },
        row.original.description,
      ),
  },
  {
    accessorKey: 'categoryName',
    header: 'Category',
  },
  {
    accessorKey: 'employeeName',
    header: 'Custodian',
    cell: ({ row }) => {
      const name = row.original.employeeName;
      return !name || name === 'None' ? '—' : name;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => h(AssetRowActions, { asset: row.original }),
  },
];
