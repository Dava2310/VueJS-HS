<script setup lang="ts">
import { computed, watch } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { toast } from 'vue-sonner';
import { RouterLink } from 'vue-router';
import { Plus } from 'lucide-vue-next';
import DashboardShell from '@/components/DashboardShell.vue';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { columns } from './components/AssetsColumns';
import { getAssets, assetsQueryKey } from './composables/useAsset';

const { data, isSuccess, isError, error } = useQuery({
  queryKey: assetsQueryKey,
  queryFn: getAssets,
  staleTime: 1000 * 60 * 5,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
});

const assets = computed(() => data.value ?? []);

watch(isSuccess, (val) => {
  if (val) toast.success('Assets loaded successfully');
});

watch([isError, error], () => {
  if (isError.value) {
    toast.error(error.value instanceof Error ? error.value.message : 'Error loading assets');
  }
});
</script>

<template>
  <DashboardShell title="Assets">
    <div class="@container/main flex flex-1 flex-col gap-4">
      <div class="flex justify-end">
        <Button as-child class="gap-2 shadow-sm">
          <RouterLink to="/assets/new">
            <Plus class="size-4" aria-hidden="true" />
            New asset
          </RouterLink>
        </Button>
      </div>
      <DataTable :columns="columns" :data="assets" :filter-columns="['name', 'sku']" />
    </div>
  </DashboardShell>
</template>
