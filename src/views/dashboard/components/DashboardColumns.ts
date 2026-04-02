import { h } from 'vue';
import { type ColumnDef } from '@tanstack/vue-table';
import { CircleCheck, UserRound } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import type { AssetVM } from '@/views/assets/composables/useAsset';

export const dashboardColumns: ColumnDef<AssetVM>[] = [
  {
    accessorKey: 'name',
    header: 'Asset',
  },
  {
    accessorKey: 'sku',
    header: 'SKU',
  },
  {
    id: 'model',
    header: 'Model',
    cell: ({ row }) => h('span', {}, `${row.original.brand} ${row.original.model}`),
  },
  {
    accessorKey: 'categoryName',
    header: 'Category',
    cell: ({ row }) =>
      h(
        Badge,
        { variant: 'outline', class: 'px-1.5 text-muted-foreground' },
        () => row.original.categoryName,
      ),
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const available = !row.original.employeeName || row.original.employeeName === 'None';
      return h(Badge, { variant: 'outline', class: 'px-1.5 text-muted-foreground' }, () => [
        available
          ? h(CircleCheck, { class: 'fill-green-500 dark:fill-green-400 stroke-none size-3.5' })
          : h(UserRound, { class: 'text-blue-500 dark:text-blue-400 size-3.5' }),
        available ? 'Available' : 'In Use',
      ]);
    },
  },
  {
    accessorKey: 'employeeName',
    header: 'Custodian',
    cell: ({ row }) => {
      const name = row.original.employeeName;
      return !name || name === 'None' ? '—' : name;
    },
  },
];
