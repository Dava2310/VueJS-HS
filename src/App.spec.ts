import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import App from './App.vue';

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', component: { template: '<div />' } }],
});

describe('App.vue', () => {
  it('mounts without errors', async () => {
    const wrapper = mount(App, {
      global: { plugins: [router] },
    });
    await router.isReady();
    expect(wrapper.exists()).toBe(true);
  });

  it('renders a RouterView', () => {
    const wrapper = mount(App, {
      global: { stubs: { RouterView: true } },
    });
    expect(wrapper.html()).toContain('router-view');
  });
});
