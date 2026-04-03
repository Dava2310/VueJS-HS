import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { VueQueryPlugin } from '@tanstack/vue-query';
import EmployeeForm from './EmployeeForm.vue';

vi.mock('vue-sonner', () => ({ toast: { promise: vi.fn(), success: vi.fn(), error: vi.fn() } }));

// ── EmployeeForm ──────────────────────────────────────────────────────────────

describe('EmployeeForm', () => {
  it('renders the "Create Employee" trigger button', () => {
    const wrapper = mount(EmployeeForm, {
      global: { plugins: [VueQueryPlugin] },
    });
    expect(wrapper.text()).toContain('Create Employee');
  });

  it('shows form fields when the dialog is open', async () => {
    const wrapper = mount(EmployeeForm, {
      attachTo: document.body,
      global: { plugins: [VueQueryPlugin] },
    });

    await wrapper.find('button[type="button"]').trigger('click');
    await wrapper.vm.$nextTick();

    expect(document.getElementById('employee-form-full-name')).toBeTruthy();
    expect(document.getElementById('employee-form-email')).toBeTruthy();
    expect(document.getElementById('employee-form-employee-code')).toBeTruthy();
    expect(document.getElementById('employee-form-password')).toBeTruthy();
    expect(document.getElementById('employee-form-role-id')).toBeTruthy();

    wrapper.unmount();
  });

  it('does not render the trigger button when an employee prop is provided', () => {
    const employee = {
      id: '1',
      fullName: 'Jane Doe',
      employeeCode: 'EMP0000001',
      email: 'jane@example.com',
      status: 'Active' as const,
      createdAt: '2025-01-01T00:00:00.000Z',
    };
    const wrapper = mount(EmployeeForm, {
      props: { employee },
      global: { plugins: [VueQueryPlugin] },
    });
    expect(wrapper.find('button[type="button"]').exists()).toBe(false);
  });
});
