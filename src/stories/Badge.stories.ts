import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { Badge } from '@/components/ui/badge';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'destructive'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: { default: 'Active' },
};

export const Secondary: Story = {
  args: { default: 'Secondary', variant: 'secondary' },
};

export const Outline: Story = {
  args: { default: 'Inactive', variant: 'outline' },
};

export const Destructive: Story = {
  args: { default: 'Deleted', variant: 'destructive' },
};

export const AllVariants: Story = {
  render: () =>
    h('div', { class: 'flex flex-wrap gap-2' }, [
      h(Badge, {}, () => 'Active'),
      h(Badge, { variant: 'secondary' }, () => 'Secondary'),
      h(Badge, { variant: 'outline' }, () => 'Inactive'),
      h(Badge, { variant: 'destructive' }, () => 'Deleted'),
    ]),
};
