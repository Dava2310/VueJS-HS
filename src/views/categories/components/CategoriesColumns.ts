import { h } from 'vue';
import { type ColumnDef } from '@tanstack/vue-table';
import { ArrowUpDown } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import type { CategoryVM } from '../composables/useCategory';
import CategoryRowActions from './CategoryRowActions.vue';

export const columns: ColumnDef<CategoryVM>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
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
    accessorKey: 'code',
    header: 'Code',
  },
  {
    accessorKey: 'description',
    header: 'Description',
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
    cell: ({ row }) => h(CategoryRowActions, { category: row.original }),
  },
];
