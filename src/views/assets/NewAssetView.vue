<script setup lang="ts">
import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { RouterLink } from 'vue-router';
import { ArrowLeft } from 'lucide-vue-next';
import DashboardShell from '@/components/DashboardShell.vue';
import { Button } from '@/components/ui/button';
import { getCategories, categoriesQueryKey } from '@/views/categories/composables/useCategory';
import { getEmployees, employeesQueryKey } from '@/views/employees/composables/useEmployee';
import AssetForm from './components/AssetForm.vue';

const { data: categoriesData } = useQuery({
  queryKey: categoriesQueryKey,
  queryFn: getCategories,
  staleTime: 1000 * 60 * 5,
});

const { data: employeesData } = useQuery({
  queryKey: employeesQueryKey,
  queryFn: getEmployees,
  staleTime: 1000 * 60 * 5,
});

const categories = computed(() => categoriesData.value ?? []);
const employees = computed(() => employeesData.value ?? []);
</script>

<template>
  <DashboardShell title="New asset">
    <div class="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <Button variant="ghost" size="sm" class="w-fit gap-2 px-0" as-child>
        <RouterLink to="/assets">
          <ArrowLeft class="size-4" aria-hidden="true" />
          Back to assets
        </RouterLink>
      </Button>
      <AssetForm :categories="categories" :employees="employees" />
    </div>
  </DashboardShell>
</template>
