import { createRouter, createWebHistory } from 'vue-router';

import DashboardView from '@/views/dashboard/DashboardView.vue';
import EmployeesView from '@/views/employees/EmployeesView.vue';
import AssetsView from '@/views/assets/AssetsView.vue';
import NewAssetView from '@/views/assets/NewAssetView.vue';
import EditAssetView from '@/views/assets/EditAssetView.vue';
import CategoriesView from '@/views/categories/CategoriesView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/dashboard', component: DashboardView },
    { path: '/employees', component: EmployeesView },
    { path: '/assets', component: AssetsView },
    { path: '/assets/new', component: NewAssetView },
    { path: '/assets/:id/edit', component: EditAssetView },
    { path: '/categories', component: CategoriesView },
  ],
});

export default router;
