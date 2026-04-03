import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Trash2 } from 'lucide-vue-next';
import { h } from 'vue';
import { Button } from '@/components/ui/button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: { default: 'Button' },
};

export const Secondary: Story = {
  args: { default: 'Secondary', variant: 'secondary' },
};

export const Outline: Story = {
  args: { default: 'Outline', variant: 'outline' },
};

export const Ghost: Story = {
  args: { default: 'Ghost', variant: 'ghost' },
};

export const Destructive: Story = {
  args: { default: 'Delete', variant: 'destructive' },
};

export const Link: Story = {
  args: { default: 'Link', variant: 'link' },
};

export const Small: Story = {
  args: { default: 'Small', size: 'sm' },
};

export const Disabled: Story = {
  args: { default: 'Disabled', disabled: true },
};

export const WithIcon: Story = {
  render: () =>
    h(Button, { variant: 'destructive' }, () => [h(Trash2, { class: 'size-4' }), 'Delete']),
};
