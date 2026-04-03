<script setup lang="ts">
import type { AssetsMetricsDto } from '@/api-client';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Layers, Package, Percent, Tag, Users } from 'lucide-vue-next';

import { formatDisponibility } from '../composables/dashboardUtils';

defineProps<{ metrics: AssetsMetricsDto }>();

const cardHeaderLayout =
  '@max-[340px]/card:has-data-[slot=card-action]:grid-cols-1 @max-[340px]/card:[&_[data-slot=card-action]]:col-start-1 @max-[340px]/card:[&_[data-slot=card-action]]:row-start-3 @max-[340px]/card:[&_[data-slot=card-action]]:row-span-1 @max-[340px]/card:[&_[data-slot=card-action]]:justify-self-start';
const metricCardActionClass = 'min-w-0 max-w-full';
const metricBadgeClass =
  'h-auto min-h-5 max-w-full shrink overflow-visible whitespace-normal py-1 leading-snug items-start';
</script>

<template>
  <div
    class="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @3xl/main:grid-cols-3 @6xl/main:grid-cols-5 dark:*:data-[slot=card]:bg-card"
  >
    <Card class="@container/card">
      <CardHeader :class="cardHeaderLayout">
        <CardDescription>Total assets</CardDescription>
        <CardTitle class="min-w-0 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {{ metrics.total.toLocaleString() }}
        </CardTitle>
        <CardAction :class="metricCardActionClass">
          <Badge variant="outline" :class="metricBadgeClass">
            <Package class="size-3.5 shrink-0" />
            All
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter class="flex-col items-start gap-1.5 text-sm">
        <div class="line-clamp-1 font-medium">Non-deleted assets in the system</div>
        <div class="text-muted-foreground">Complete inventory count</div>
      </CardFooter>
    </Card>

    <Card class="@container/card">
      <CardHeader :class="cardHeaderLayout">
        <CardDescription>Available</CardDescription>
        <CardTitle class="min-w-0 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {{ metrics.availables.toLocaleString() }}
        </CardTitle>
        <CardAction :class="metricCardActionClass">
          <Badge variant="outline" :class="metricBadgeClass">
            <Layers class="size-3.5 shrink-0" />
            Unassigned
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter class="flex-col items-start gap-1.5 text-sm">
        <div class="line-clamp-1 font-medium">Not assigned to any employee</div>
        <div class="text-muted-foreground">Ready to assign</div>
      </CardFooter>
    </Card>

    <Card class="@container/card">
      <CardHeader :class="cardHeaderLayout">
        <CardDescription>Assigned</CardDescription>
        <CardTitle class="min-w-0 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {{ metrics.assigned.toLocaleString() }}
        </CardTitle>
        <CardAction :class="metricCardActionClass">
          <Badge variant="outline" :class="metricBadgeClass">
            <Users class="size-3.5 shrink-0" />
            In use
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter class="flex-col items-start gap-1.5 text-sm">
        <div class="line-clamp-1 font-medium">Linked to an employee</div>
        <div class="text-muted-foreground">Currently allocated</div>
      </CardFooter>
    </Card>

    <Card class="@container/card">
      <CardHeader :class="cardHeaderLayout">
        <CardDescription>Disponibility</CardDescription>
        <CardTitle class="min-w-0 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {{ formatDisponibility(metrics.disponibility) }}
        </CardTitle>
        <CardAction :class="metricCardActionClass">
          <Badge variant="outline" :class="metricBadgeClass">
            <Percent class="size-3.5 shrink-0" />
            Unassigned share
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter class="flex-col items-start gap-1.5 text-sm">
        <div class="line-clamp-1 font-medium">Share of assets that are unassigned</div>
        <div class="text-muted-foreground">0–100% of inventory</div>
      </CardFooter>
    </Card>

    <Card class="@container/card">
      <CardHeader :class="cardHeaderLayout">
        <CardDescription>Popular category</CardDescription>
        <CardTitle class="min-w-0 line-clamp-2 text-2xl font-semibold @[250px]/card:text-3xl">
          {{ metrics.popularCategory || 'N/A' }}
        </CardTitle>
        <CardAction :class="metricCardActionClass">
          <Badge variant="outline" :class="metricBadgeClass">
            <Tag class="size-3.5 shrink-0" />
            Top
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter class="flex-col items-start gap-1.5 text-sm">
        <div class="line-clamp-1 font-medium">Category with the most assets</div>
        <div class="text-muted-foreground">N/A when there are no categories</div>
      </CardFooter>
    </Card>
  </div>
</template>
