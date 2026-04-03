import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import type { AssetsMetricsDto } from '@/api-client';
import SectionCards from './SectionCards.vue';

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeMetrics(overrides: Partial<AssetsMetricsDto> = {}): AssetsMetricsDto {
  return {
    total: 48,
    availables: 12,
    assigned: 36,
    disponibility: 25,
    popularCategory: 'Laptops',
    ...overrides,
  };
}

// ── SectionCards ──────────────────────────────────────────────────────────────

describe('SectionCards', () => {
  it('renders all 5 card headings', () => {
    const wrapper = mount(SectionCards, { props: { metrics: makeMetrics() } });
    const text = wrapper.text();

    expect(text).toContain('Total assets');
    expect(text).toContain('Available');
    expect(text).toContain('Assigned');
    expect(text).toContain('Disponibility');
    expect(text).toContain('Popular category');
  });

  it('displays the correct metric values', () => {
    const wrapper = mount(SectionCards, { props: { metrics: makeMetrics() } });
    const text = wrapper.text();

    expect(text).toContain('48');
    expect(text).toContain('12');
    expect(text).toContain('36');
    expect(text).toContain('25%');
    expect(text).toContain('Laptops');
  });

  it('formats a non-integer disponibility to one decimal place', () => {
    const wrapper = mount(SectionCards, {
      props: { metrics: makeMetrics({ disponibility: 33.333 }) },
    });
    expect(wrapper.text()).toContain('33.3%');
  });

  it('shows "N/A" when popularCategory is empty', () => {
    const wrapper = mount(SectionCards, {
      props: { metrics: makeMetrics({ popularCategory: '' }) },
    });
    expect(wrapper.text()).toContain('N/A');
  });
});
