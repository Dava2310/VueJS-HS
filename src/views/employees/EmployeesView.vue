<script setup lang="ts">
import { computed, watch } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { toast } from 'vue-sonner';
import DashboardShell from '@/components/DashboardShell.vue';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './components/EmployeesColumns';
import { getEmployees, employeesQueryKey } from './composables/useEmployee';
import EmployeeForm from './components/EmployeeForm.vue';

const { data, isSuccess, isError, error } = useQuery({
  queryKey: employeesQueryKey,
  queryFn: getEmployees,
  staleTime: 1000 * 60 * 5,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
});

const employees = computed(() => data.value ?? []);

watch(isSuccess, (val) => {
  if (val) toast.success('Employees loaded successfully');
});

watch([isError, error], () => {
  if (isError.value) {
    toast.error(error.value instanceof Error ? error.value.message : 'Error loading employees');
  }
});
</script>

<template>
  <DashboardShell title="Employees">
    <div class="@container/main flex flex-1 flex-col gap-2">
      <EmployeeForm />
      <DataTable :columns="columns" :data="employees" :filter-columns="['email']" />
    </div>
  </DashboardShell>
</template>
