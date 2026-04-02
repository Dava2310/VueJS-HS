<script setup lang="ts">
import { ref, computed } from 'vue';
import type { AssetCreationTimeSeriesPointDto } from '@/api-client';
import type { ChartConfig } from '@/components/ui/chart';
import { VisArea, VisAxis, VisLine, VisXYContainer } from '@unovis/vue';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartCrosshair,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  componentToString,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type TimeSeriesRange = '3m' | '6m' | 'year';

const props = defineProps<{
  data: AssetCreationTimeSeriesPointDto[];
  year: number;
}>();

const chartConfig = {
  total: {
    label: 'Assets created',
    color: 'var(--primary)',
  },
} satisfies ChartConfig;

function monthIndexFromName(monthName: string): number {
  const t = Date.parse(`${monthName} 1, 2000`);
  if (Number.isNaN(t)) return 12;
  return new Date(t).getMonth();
}

function sortByCalendarMonth(points: AssetCreationTimeSeriesPointDto[]) {
  return [...points].sort((a, b) => monthIndexFromName(a.month) - monthIndexFromName(b.month));
}

function filterPointsByRange(
  points: AssetCreationTimeSeriesPointDto[],
  range: TimeSeriesRange,
  year: number,
): AssetCreationTimeSeriesPointDto[] {
  const sorted = sortByCalendarMonth(points);
  if (range === 'year') return sorted;

  const n = range === '3m' ? 3 : 6;
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  if (year === currentYear) {
    const startMonth = Math.max(0, currentMonth - (n - 1));
    return sorted.filter((p) => {
      const m = monthIndexFromName(p.month);
      return m >= startMonth && m <= currentMonth;
    });
  }

  if (year < currentYear) {
    const startMonth = 12 - n;
    return sorted.filter((p) => monthIndexFromName(p.month) >= startMonth);
  }

  return [];
}

const rangeLabels: Record<TimeSeriesRange, string> = {
  '3m': 'Last 3 months',
  '6m': 'Last 6 months',
  year: 'Whole year',
};

const timeRange = ref<TimeSeriesRange>('year');

type ChartPoint = { index: number; month: string; total: number };

const chartData = computed<ChartPoint[]>(() =>
  filterPointsByRange(props.data, timeRange.value, props.year).map((p, i) => ({
    index: i,
    month: p.month,
    total: p.total,
  })),
);

const monthLabels = computed(() => chartData.value.map((p) => p.month.slice(0, 3)));

const yMax = computed(() => Math.max(...chartData.value.map((p) => p.total), 5));

const svgDefs = `
  <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%" stop-color="var(--color-total)" stop-opacity="0.9" />
    <stop offset="95%" stop-color="var(--color-total)" stop-opacity="0.1" />
  </linearGradient>
`;
</script>

<template>
  <Card class="@container/card pt-0">
    <CardHeader class="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
      <div class="grid flex-1 gap-1">
        <CardTitle>Asset creations</CardTitle>
        <CardDescription>
          <span class="hidden @[540px]/card:block">
            New assets per month ({{ year }}) — {{ rangeLabels[timeRange].toLowerCase() }}
          </span>
          <span class="@[540px]/card:hidden">{{ rangeLabels[timeRange] }}</span>
        </CardDescription>
      </div>
      <CardAction>
        <Select v-model="timeRange">
          <SelectTrigger class="w-[160px] rounded-lg" aria-label="Time range">
            <SelectValue :placeholder="rangeLabels.year" />
          </SelectTrigger>
          <SelectContent class="rounded-xl">
            <SelectItem value="3m" class="rounded-lg">Last 3 months</SelectItem>
            <SelectItem value="6m" class="rounded-lg">Last 6 months</SelectItem>
            <SelectItem value="year" class="rounded-lg">Whole year</SelectItem>
          </SelectContent>
        </Select>
      </CardAction>
    </CardHeader>
    <CardContent class="px-2 pt-4 sm:px-6 sm:pt-6 pb-4">
      <ChartContainer :config="chartConfig" class="aspect-auto h-[250px] w-full" :cursor="false">
        <VisXYContainer
          :data="chartData"
          :svg-defs="svgDefs"
          :margin="{ left: -40 }"
          :y-domain="[0, yMax * 1.2]"
        >
          <VisArea
            :x="(d: ChartPoint) => d.index"
            :y="(d: ChartPoint) => d.total"
            :color="() => 'url(#fillTotal)'"
            :opacity="0.6"
          />
          <VisLine
            :x="(d: ChartPoint) => d.index"
            :y="(d: ChartPoint) => d.total"
            :color="() => chartConfig.total.color"
            :line-width="1.5"
          />
          <VisAxis
            type="x"
            :x="(d: ChartPoint) => d.index"
            :tick-line="false"
            :domain-line="false"
            :grid-line="false"
            :num-ticks="chartData.length"
            :tick-format="(d: number | Date) => monthLabels[Math.round(Number(d))] ?? ''"
          />
          <VisAxis type="y" :num-ticks="4" :tick-line="false" :domain-line="false" />
          <ChartTooltip />
          <ChartCrosshair
            :template="
              componentToString(chartConfig, ChartTooltipContent, {
                labelFormatter: (d: number | Date) => chartData[Math.round(Number(d))]?.month ?? '',
              })
            "
            :color="() => chartConfig.total.color"
          />
        </VisXYContainer>
        <ChartLegendContent />
      </ChartContainer>
    </CardContent>
  </Card>
</template>
