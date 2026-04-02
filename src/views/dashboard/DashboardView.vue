<script setup lang="ts">
import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import DashboardShell from '@/components/DashboardShell.vue';
import { DataTable } from '@/components/ui/data-table';
import ChartAreaInteractive from './components/ChartAreaInteractive.vue';
import SectionCards from './components/SectionCards.vue';
import { dashboardColumns } from './components/DashboardColumns';
import {
  getAssetsMetrics,
  assetsMetricsQueryKey,
  getAssetTimeSeries,
  assetTimeSeriesQueryKey,
} from './composables/useDashboard';
import { getAssets, assetsQueryKey } from '@/views/assets/composables/useAsset';

const year = new Date().getFullYear();

const { data: metrics } = useQuery({
  queryKey: assetsMetricsQueryKey,
  queryFn: getAssetsMetrics,
  staleTime: 1000 * 60 * 5,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
});

const { data: timeSeries, isPending: timeSeriesPending } = useQuery({
  queryKey: computed(() => assetTimeSeriesQueryKey(year)),
  queryFn: () => getAssetTimeSeries(year),
  staleTime: 1000 * 60 * 5,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
});

const { data: assets } = useQuery({
  queryKey: assetsQueryKey,
  queryFn: getAssets,
  staleTime: 1000 * 60 * 5,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
});
</script>

<template>
  <DashboardShell title="Dashboard">
    <div class="@container/main flex flex-1 flex-col gap-2">
      <div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards v-if="metrics" :metrics="metrics" />
        <div class="px-4 lg:px-6">
          <div
            v-if="timeSeriesPending"
            class="h-[318px] animate-pulse rounded-xl bg-muted"
            aria-hidden="true"
          />
          <ChartAreaInteractive v-else :data="timeSeries ?? []" :year="year" />
        </div>
        <DataTable :columns="dashboardColumns" :data="assets ?? []" />
      </div>
    </div>
  </DashboardShell>
</template>
