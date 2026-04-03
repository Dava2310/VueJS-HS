import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const meta: Meta = {
  title: 'UI/Card',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () =>
    h(Card, { class: 'w-80' }, () => [
      h(CardHeader, {}, () => [
        h(CardTitle, {}, () => 'Card Title'),
        h(CardDescription, {}, () => 'Card description goes here.'),
      ]),
      h(CardContent, {}, () =>
        h('p', { class: 'text-sm text-muted-foreground' }, 'Card body content.'),
      ),
    ]),
};

export const WithFooter: Story = {
  render: () =>
    h(Card, { class: 'w-80' }, () => [
      h(CardHeader, {}, () => [
        h(CardTitle, {}, () => 'Employee'),
        h(CardDescription, {}, () => 'John Doe · john@example.com'),
      ]),
      h(CardContent, {}, () =>
        h('p', { class: 'text-sm text-muted-foreground' }, 'Role: Administrator'),
      ),
      h(CardFooter, { class: 'flex justify-end gap-2' }, () => [
        h(Button, { variant: 'outline', size: 'sm' }, () => 'Cancel'),
        h(Button, { size: 'sm' }, () => 'Save'),
      ]),
    ]),
};

export const MetricCard: Story = {
  render: () =>
    h(Card, { class: 'w-48' }, () => [
      h(CardHeader, { class: 'pb-2' }, () => [
        h(CardDescription, {}, () => 'Total Assets'),
        h(CardTitle, { class: 'text-4xl' }, () => '48'),
      ]),
      h(CardContent, {}, () => h(Badge, {}, () => 'Active')),
    ]),
};
