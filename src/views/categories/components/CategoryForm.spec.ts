import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { VueQueryPlugin } from '@tanstack/vue-query';
import CategoryForm from './CategoryForm.vue';

vi.mock('vue-sonner', () => ({ toast: { promise: vi.fn(), success: vi.fn(), error: vi.fn() } }));

// ── CategoryForm ──────────────────────────────────────────────────────────────

describe('CategoryForm', () => {
  it('renders the "Create Category" trigger button', () => {
    const wrapper = mount(CategoryForm, {
      global: { plugins: [VueQueryPlugin] },
    });
    expect(wrapper.text()).toContain('Create Category');
  });

  it('shows form fields when the dialog is open', async () => {
    const wrapper = mount(CategoryForm, {
      attachTo: document.body,
      global: { plugins: [VueQueryPlugin] },
    });

    await wrapper.find('button[type="button"]').trigger('click');
    await wrapper.vm.$nextTick();

    expect(document.getElementById('category-form-name')).toBeTruthy();
    expect(document.getElementById('category-form-code')).toBeTruthy();
    expect(document.getElementById('category-form-description')).toBeTruthy();

    wrapper.unmount();
  });

  it('does not render the trigger button when a category prop is provided', () => {
    const category = {
      id: '1',
      name: 'Laptops',
      code: 'lap-001',
      description: 'Portable computers',
      status: 'Active' as const,
      createdAt: '2025-01-01T00:00:00.000Z',
    };
    const wrapper = mount(CategoryForm, {
      props: { category },
      global: { plugins: [VueQueryPlugin] },
    });
    expect(wrapper.find('button[type="button"]').exists()).toBe(false);
  });
});
