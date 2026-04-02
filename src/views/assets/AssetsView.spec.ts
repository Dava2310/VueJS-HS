import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { createRouter, createMemoryHistory } from 'vue-router';
import AssetsView from './AssetsView.vue';

vi.mock('@unhead/vue', () => ({ useHead: vi.fn() }));
vi.mock('vue-sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock('./composables/useAsset', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./composables/useAsset')>()),
  getAssets: vi.fn(() => new Promise(() => {})),
}));

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', component: { template: '<div />' } }],
});

// ── AssetsView ────────────────────────────────────────────────────────────────

describe('AssetsView', () => {
  it('renders the "New asset" button', async () => {
    const wrapper = mount(AssetsView, {
      global: {
        plugins: [VueQueryPlugin, router],
        stubs: { DashboardShell: { template: '<div><slot /></div>' }, DataTable: true },
      },
    });

    await router.isReady();
    expect(wrapper.text()).toContain('New asset');
  });
});
