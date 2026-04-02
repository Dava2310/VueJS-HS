<script setup lang="ts">
import { Command, LayoutDashboard, IdCardLanyard, Box, List } from 'lucide-vue-next';

import NavMain from '@/components/NavMain.vue';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

defineProps<{
  variant?: 'sidebar' | 'floating' | 'inset';
}>();

const navMain = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Employees', url: '/employees', icon: IdCardLanyard },
  { title: 'Assets', url: '/assets', icon: Box },
  { title: 'Categories', url: '/categories', icon: List },
];
</script>

<template>
  <Sidebar collapsible="offcanvas" :variant="variant">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton as-child class="data-[slot=sidebar-menu-button]:p-1.5!">
            <a href="#">
              <Command class="size-5!" />
              <span class="text-base font-semibold">IT Assets Tracker.</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="navMain" />
    </SidebarContent>
  </Sidebar>
</template>
