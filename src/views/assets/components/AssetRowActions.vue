<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query';
import { toast } from 'vue-sonner';
import { MoreHorizontal } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { AssetVM } from '../composables/useAsset';
import { deleteAsset, freeAsset, assetsQueryKey } from '../composables/useAsset';

const props = defineProps<{ asset: AssetVM }>();

const router = useRouter();
const queryClient = useQueryClient();

const handleDelete = () => {
  toast.promise(deleteAsset(parseInt(props.asset.id, 10)), {
    duration: 3000,
    loading: 'Loading...',
    success: (message: string) => {
      queryClient.setQueryData<AssetVM[]>(
        [...assetsQueryKey],
        (prev) => prev?.filter((a) => a.id !== props.asset.id) ?? prev,
      );
      return message;
    },
    error: (error: Error) => error.message,
  });
};

const handleFree = () => {
  toast.promise(freeAsset(parseInt(props.asset.id, 10)), {
    duration: 3000,
    loading: 'Loading...',
    success: (message: string) => {
      queryClient.setQueryData<AssetVM[]>(
        [...assetsQueryKey],
        (prev) =>
          prev?.map((a) =>
            a.id === props.asset.id ? { ...a, employeeId: '0', employeeName: 'None' } : a,
          ) ?? prev,
      );
      return message;
    },
    error: (error: Error) => error.message,
  });
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
      <DropdownMenuItem @select="router.push(`/assets/${asset.id}/edit`)">Update</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @select="router.push(`/assets/${asset.id}/edit?view=1`)"
        >View</DropdownMenuItem
      >
      <DropdownMenuItem @select="handleDelete">Delete</DropdownMenuItem>
      <DropdownMenuItem @select="handleFree">Unassign Employee</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
