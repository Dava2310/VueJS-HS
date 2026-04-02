<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { ArrowLeft, Loader2 } from 'lucide-vue-next';
import DashboardShell from '@/components/DashboardShell.vue';
import { Button } from '@/components/ui/button';
import { getCategories, categoriesQueryKey } from '@/views/categories/composables/useCategory';
import { getEmployees, employeesQueryKey } from '@/views/employees/composables/useEmployee';
import { getAsset, assetsQueryKey } from './composables/useAsset';
import AssetForm from './components/AssetForm.vue';

const route = useRoute();

const idParam = route.params.id as string;
const id = parseInt(idParam, 10);
const readOnly = route.query.view === '1';
const invalidId = !idParam || !Number.isFinite(id) || id <= 0;

const {
  data: assetData,
  isLoading,
  isError,
  error,
} = useQuery({
  queryKey: [...assetsQueryKey, id],
  queryFn: () => getAsset(id),
  enabled: !invalidId,
  staleTime: 1000 * 60 * 5,
  retry: false,
});

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

const title = readOnly ? 'View asset' : 'Edit asset';
const loadError = computed(() =>
  isError.value
    ? error.value instanceof Error
      ? error.value.message
      : 'Could not load asset.'
    : null,
);
</script>

<template>
  <DashboardShell :title="title">
    <div class="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <Button variant="ghost" size="sm" class="w-fit gap-2 px-0" as-child>
        <RouterLink to="/assets">
          <ArrowLeft class="size-4" aria-hidden="true" />
          Back to assets
        </RouterLink>
      </Button>

      <p v-if="invalidId" class="text-destructive text-sm">Invalid asset ID.</p>

      <p v-else-if="loadError" class="text-destructive text-sm">{{ loadError }}</p>

      <div v-else-if="isLoading" class="text-muted-foreground flex items-center gap-2 text-sm">
        <Loader2 class="size-4 animate-spin" aria-hidden="true" />
        Loading asset…
      </div>

      <AssetForm
        v-else-if="assetData"
        :key="assetData.id"
        :asset="assetData"
        :read-only="readOnly"
        :categories="categories"
        :employees="employees"
      />
    </div>
  </DashboardShell>
</template>
