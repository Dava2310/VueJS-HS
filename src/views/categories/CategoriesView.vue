<script setup lang="ts">
import { computed, watch } from 'vue';
import { useHead } from '@unhead/vue';
import { useQuery } from '@tanstack/vue-query';
import { toast } from 'vue-sonner';

useHead({ title: 'Categories' });
import DashboardShell from '@/components/DashboardShell.vue';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './components/CategoriesColumns';
import { getCategories, categoriesQueryKey } from './composables/useCategory';
import CategoryForm from './components/CategoryForm.vue';

const { data, isSuccess, isError, error } = useQuery({
  queryKey: categoriesQueryKey,
  queryFn: getCategories,
  staleTime: 1000 * 60 * 5,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
});

const categories = computed(() => data.value ?? []);

watch(isSuccess, (val) => {
  if (val) toast.success('Categories loaded successfully');
});

watch([isError, error], () => {
  if (isError.value) {
    toast.error(error.value instanceof Error ? error.value.message : 'Error loading categories');
  }
});
</script>

<template>
  <DashboardShell title="Categories">
    <div class="@container/main flex flex-1 flex-col gap-2">
      <CategoryForm />
      <DataTable :columns="columns" :data="categories" :filter-columns="['name']" />
    </div>
  </DashboardShell>
</template>
