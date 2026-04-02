import { h } from 'vue';
import { type ColumnDef } from '@tanstack/vue-table';
import { ArrowUpDown } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import type { EmployeeVM } from '../composables/useEmployee';
import EmployeeRowActions from './EmployeeRowActions.vue';

export const columns: ColumnDef<EmployeeVM>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'employeeCode',
    header: 'Employee Code',
  },
  {
    accessorKey: 'fullName',
    header: 'Full Name',
  },
  {
    accessorKey: 'email',
    header: ({ column }) =>
      h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['Email', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
      ),
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
    cell: ({ row }) => h(EmployeeRowActions, { employee: row.original }),
  },
];
