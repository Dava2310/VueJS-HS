import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';

const meta: Meta = {
  title: 'UI/Colors',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const groups = [
  {
    label: 'Base',
    tokens: [
      { name: 'Background', variable: '--background' },
      { name: 'Foreground', variable: '--foreground' },
      { name: 'Border', variable: '--border' },
      { name: 'Input', variable: '--input' },
      { name: 'Ring', variable: '--ring' },
    ],
  },
  {
    label: 'Primary',
    tokens: [
      { name: 'Primary', variable: '--primary' },
      { name: 'Primary Foreground', variable: '--primary-foreground' },
    ],
  },
  {
    label: 'Secondary',
    tokens: [
      { name: 'Secondary', variable: '--secondary' },
      { name: 'Secondary Foreground', variable: '--secondary-foreground' },
    ],
  },
  {
    label: 'Muted',
    tokens: [
      { name: 'Muted', variable: '--muted' },
      { name: 'Muted Foreground', variable: '--muted-foreground' },
    ],
  },
  {
    label: 'Accent',
    tokens: [
      { name: 'Accent', variable: '--accent' },
      { name: 'Accent Foreground', variable: '--accent-foreground' },
    ],
  },
  {
    label: 'Destructive',
    tokens: [
      { name: 'Destructive', variable: '--destructive' },
      { name: 'Destructive Foreground', variable: '--destructive-foreground' },
    ],
  },
  {
    label: 'Card',
    tokens: [
      { name: 'Card', variable: '--card' },
      { name: 'Card Foreground', variable: '--card-foreground' },
    ],
  },
  {
    label: 'Sidebar',
    tokens: [
      { name: 'Sidebar', variable: '--sidebar' },
      { name: 'Sidebar Foreground', variable: '--sidebar-foreground' },
      { name: 'Sidebar Primary', variable: '--sidebar-primary' },
      { name: 'Sidebar Accent', variable: '--sidebar-accent' },
      { name: 'Sidebar Border', variable: '--sidebar-border' },
    ],
  },
  {
    label: 'Chart',
    tokens: [
      { name: 'Chart 1', variable: '--chart-1' },
      { name: 'Chart 2', variable: '--chart-2' },
      { name: 'Chart 3', variable: '--chart-3' },
      { name: 'Chart 4', variable: '--chart-4' },
      { name: 'Chart 5', variable: '--chart-5' },
    ],
  },
];

function swatch(name: string, variable: string) {
  return h('div', { class: 'flex flex-col gap-1.5' }, [
    h('div', {
      class: 'h-12 w-full rounded-md border border-border',
      style: { background: `var(${variable})` },
    }),
    h('p', { class: 'text-xs font-medium leading-none' }, name),
    h('p', { class: 'font-mono text-xs text-muted-foreground' }, variable),
  ]);
}

export const Palette: Story = {
  render: () =>
    h(
      'div',
      { class: 'flex flex-col gap-8 p-4' },
      groups.map((group) =>
        h('div', { key: group.label }, [
          h(
            'h3',
            { class: 'mb-3 text-sm font-semibold tracking-wide uppercase text-muted-foreground' },
            group.label,
          ),
          h(
            'div',
            { class: 'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5' },
            group.tokens.map((token) => swatch(token.name, token.variable)),
          ),
        ]),
      ),
    ),
};
