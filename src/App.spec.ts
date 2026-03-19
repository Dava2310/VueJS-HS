import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import App from './App.vue';

describe('App.vue', () => {
  let wrapper: ReturnType<typeof mount<typeof App>>;

  beforeEach(() => {
    wrapper = mount(App);
  });

  it('renders the counter with initial value of 0', () => {
    expect(wrapper.text()).toContain('Counter: 0');
  });

  it('renders the step input', () => {
    const input = wrapper.find('input#step');
    expect(input.exists()).toBe(true);
    expect((input.element as HTMLInputElement).type).toBe('number');
  });

  it('renders Increment, Decrement and Clear buttons', () => {
    expect(wrapper.find('[data-testid="increment-btn"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="decrement-btn"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="clear-btn"]').exists()).toBe(true);
  });

  it('increments the counter by the default step of 1', async () => {
    await wrapper.find('[data-testid="increment-btn"]').trigger('click');
    expect(wrapper.text()).toContain('Counter: 1');
  });

  it('decrements the counter by the default step of 1', async () => {
    await wrapper.find('[data-testid="decrement-btn"]').trigger('click');
    expect(wrapper.text()).toContain('Counter: -1');
  });

  it('clears the counter back to 0', async () => {
    const incrementBtn = wrapper.find('[data-testid="increment-btn"]');
    await incrementBtn.trigger('click');
    await incrementBtn.trigger('click');
    expect(wrapper.text()).toContain('Counter: 2');
    await wrapper.find('[data-testid="clear-btn"]').trigger('click');
    expect(wrapper.text()).toContain('Counter: 0');
  });

  it('increments by the configured step', async () => {
    await wrapper.find('input#step').setValue(5);
    await wrapper.find('[data-testid="increment-btn"]').trigger('click');
    expect(wrapper.text()).toContain('Counter: 5');
  });

  it('decrements by the configured step', async () => {
    await wrapper.find('input#step').setValue(3);
    await wrapper.find('[data-testid="decrement-btn"]').trigger('click');
    expect(wrapper.text()).toContain('Counter: -3');
  });

  it('accumulates multiple increments correctly', async () => {
    const incrementBtn = wrapper.find('[data-testid="increment-btn"]');
    await incrementBtn.trigger('click');
    await incrementBtn.trigger('click');
    await incrementBtn.trigger('click');
    expect(wrapper.text()).toContain('Counter: 3');
  });
});
