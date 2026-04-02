<script setup lang="ts">
import { ref } from 'vue';
import { useQueryClient } from '@tanstack/vue-query';
import { toast } from 'vue-sonner';
import { MoreHorizontal } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { EmployeeVM } from '../composables/useEmployee';
import { deleteEmployee, employeesQueryKey } from '../composables/useEmployee';
import EmployeeForm from './EmployeeForm.vue';

const props = defineProps<{ employee: EmployeeVM }>();

const editOpen = ref(false);
const readOnly = ref(false);
const queryClient = useQueryClient();

const handleDelete = () => {
  toast.promise(deleteEmployee(parseInt(props.employee.id)), {
    duration: 3000,
    loading: 'Loading...',
    success: (message: string) => {
      queryClient.setQueryData<EmployeeVM[]>(
        [...employeesQueryKey],
        (prev) => prev?.filter((e) => e.id !== props.employee.id) ?? prev,
      );
      return message;
    },
    error: (error: Error) => error.message,
  });
};

const handleUpdate = () => {
  readOnly.value = false;
  editOpen.value = true;
};

const handleView = () => {
  readOnly.value = true;
  editOpen.value = true;
};
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="h-8 w-8 p-0">
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem @select="handleUpdate">Update</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @select="handleView">View</DropdownMenuItem>
      <DropdownMenuItem @select="handleDelete">Delete</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
  <EmployeeForm
    v-if="editOpen"
    v-model:open="editOpen"
    :employee="employee"
    :read-only="readOnly"
  />
</template>
