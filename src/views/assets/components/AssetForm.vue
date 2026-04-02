<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm, Field as VeeField } from 'vee-validate';
import { useQueryClient } from '@tanstack/vue-query';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { Building2, Cpu, FileText, Hash, Package } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CategoryVM } from '@/views/categories/composables/useCategory';
import type { EmployeeVM } from '@/views/employees/composables/useEmployee';
import {
  assetFormSchema,
  assetsQueryKey,
  createAsset,
  updateAsset,
  type AssetVM,
  type AssetFormValues,
} from '../composables/useAsset';

const props = defineProps<{
  asset?: AssetVM;
  readOnly?: boolean;
  categories: CategoryVM[];
  employees: EmployeeVM[];
}>();

const router = useRouter();
const queryClient = useQueryClient();

const headline = props.readOnly ? 'View asset' : props.asset ? 'Update asset' : 'Create asset';
const subtitle = props.readOnly
  ? 'Asset details (read-only).'
  : 'Fill in the details below to register or update an asset.';

const { handleSubmit, resetForm, values } = useForm<AssetFormValues>({
  validationSchema: toTypedSchema(assetFormSchema),
  initialValues: {
    name: props.asset?.name ?? '',
    sku: props.asset?.sku ?? '',
    description: props.asset?.description ?? '',
    model: props.asset?.model ?? '',
    brand: props.asset?.brand ?? '',
    categoryId: props.asset?.categoryId ?? '',
    employeeId: props.asset?.employeeId ?? '',
  },
});

const onSubmit = handleSubmit((data: AssetFormValues) => {
  const payload = {
    name: data.name,
    sku: data.sku,
    description: data.description,
    model: data.model,
    brand: data.brand,
    categoryId: parseInt(data.categoryId, 10),
    employeeId: parseInt(data.employeeId, 10),
  };

  if (!props.asset) {
    toast.promise(createAsset(payload), {
      duration: 3000,
      loading: 'Loading...',
      success: ({ message, newData }: { message: string; newData: AssetVM }) => {
        queryClient.setQueryData<AssetVM[]>([...assetsQueryKey], (prev) =>
          prev ? [...prev, newData] : [newData],
        );
        router.push('/assets');
        return message;
      },
      error: (error: Error) => error.message,
    });
  } else {
    toast.promise(updateAsset(parseInt(props.asset.id, 10), payload), {
      duration: 3000,
      loading: 'Loading...',
      success: ({ message, updatedData }: { message: string; updatedData: AssetVM }) => {
        queryClient.setQueryData<AssetVM[]>(
          [...assetsQueryKey],
          (prev) => prev?.map((a) => (a.id === updatedData.id ? updatedData : a)) ?? prev,
        );
        router.push('/assets');
        return message;
      },
      error: (error: Error) => error.message,
    });
  }
});
</script>

<template>
  <div class="mx-auto w-full max-w-2xl space-y-6">
    <div class="space-y-1">
      <h1 class="text-2xl font-semibold tracking-tight">{{ headline }}</h1>
      <p class="text-muted-foreground text-sm">{{ subtitle }}</p>
    </div>

    <Card>
      <CardHeader class="border-b">
        <CardTitle class="flex items-center gap-2 text-lg">
          <Package class="size-5 text-muted-foreground" aria-hidden="true" />
          Asset information
        </CardTitle>
        <CardDescription>Fields marked as required are validated before submit.</CardDescription>
      </CardHeader>
      <CardContent class="pt-6">
        <form id="asset-form" @submit="onSubmit">
          <FieldGroup>
            <VeeField v-slot="{ field, errors }" name="name">
              <Field :data-invalid="!!errors.length">
                <FieldLabel for="asset-form-name">Name</FieldLabel>
                <InputGroup class="h-10">
                  <InputGroupAddon align="inline-start">
                    <Package class="text-muted-foreground" aria-hidden="true" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="asset-form-name"
                    :model-value="field.value"
                    :readonly="readOnly"
                    placeholder="MacBook Pro 14"
                    autocomplete="off"
                    :aria-invalid="!!errors.length"
                    @update:model-value="field.onChange"
                    @blur="field.onBlur"
                  />
                </InputGroup>
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>

            <VeeField v-slot="{ field, errors }" name="sku">
              <Field :data-invalid="!!errors.length">
                <FieldLabel for="asset-form-sku">SKU</FieldLabel>
                <InputGroup class="h-10">
                  <InputGroupAddon align="inline-start">
                    <Hash class="text-muted-foreground" aria-hidden="true" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="asset-form-sku"
                    :model-value="field.value"
                    :readonly="readOnly"
                    placeholder="LAPTOP-MBP14-001"
                    autocomplete="off"
                    :aria-invalid="!!errors.length"
                    @update:model-value="field.onChange"
                    @blur="field.onBlur"
                  />
                </InputGroup>
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>

            <VeeField v-slot="{ field, errors }" name="description">
              <Field :data-invalid="!!errors.length">
                <FieldLabel for="asset-form-description">Description</FieldLabel>
                <InputGroup class="min-h-32">
                  <InputGroupAddon align="block-start">
                    <FileText class="text-muted-foreground" aria-hidden="true" />
                    <InputGroupText>Long-form notes</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupTextarea
                    id="asset-form-description"
                    :model-value="field.value"
                    :readonly="readOnly"
                    placeholder="Condition, location, or other notes"
                    :rows="5"
                    class="min-h-24"
                    :aria-invalid="!!errors.length"
                    @update:model-value="field.onChange"
                    @blur="field.onBlur"
                  />
                  <InputGroupAddon align="block-end">
                    <InputGroupText class="tabular-nums">
                      {{ (values.description as string)?.length ?? 0 }}/500 characters
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>

            <VeeField v-slot="{ field, errors }" name="model">
              <Field :data-invalid="!!errors.length">
                <FieldLabel for="asset-form-model">Model</FieldLabel>
                <InputGroup class="h-10">
                  <InputGroupAddon align="inline-start">
                    <Cpu class="text-muted-foreground" aria-hidden="true" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="asset-form-model"
                    :model-value="field.value"
                    :readonly="readOnly"
                    placeholder="A2992"
                    autocomplete="off"
                    :aria-invalid="!!errors.length"
                    @update:model-value="field.onChange"
                    @blur="field.onBlur"
                  />
                </InputGroup>
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>

            <VeeField v-slot="{ field, errors }" name="brand">
              <Field :data-invalid="!!errors.length">
                <FieldLabel for="asset-form-brand">Brand</FieldLabel>
                <InputGroup class="h-10">
                  <InputGroupAddon align="inline-start">
                    <Building2 class="text-muted-foreground" aria-hidden="true" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="asset-form-brand"
                    :model-value="field.value"
                    :readonly="readOnly"
                    placeholder="Apple"
                    autocomplete="off"
                    :aria-invalid="!!errors.length"
                    @update:model-value="field.onChange"
                    @blur="field.onBlur"
                  />
                </InputGroup>
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>

            <VeeField v-slot="{ field, errors }" name="categoryId">
              <Field :data-invalid="!!errors.length">
                <FieldLabel for="asset-form-category-id">Category</FieldLabel>
                <Select
                  :model-value="field.value || undefined"
                  :disabled="readOnly"
                  @update:model-value="field.onChange"
                  @blur="field.onBlur"
                >
                  <SelectTrigger
                    id="asset-form-category-id"
                    class="h-10 w-full"
                    :aria-invalid="!!errors.length"
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem v-for="cat in categories" :key="cat.id" :value="cat.id">
                        {{ cat.code ? `${cat.name} (${cat.code})` : cat.name }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldDescription>Category this asset belongs to</FieldDescription>
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>

            <VeeField v-slot="{ field, errors }" name="employeeId">
              <Field :data-invalid="!!errors.length">
                <FieldLabel for="asset-form-employee-id">Custodian</FieldLabel>
                <Select
                  :model-value="field.value || undefined"
                  :disabled="readOnly"
                  @update:model-value="field.onChange"
                  @blur="field.onBlur"
                >
                  <SelectTrigger
                    id="asset-form-employee-id"
                    class="h-10 w-full"
                    :aria-invalid="!!errors.length"
                  >
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem v-for="emp in employees" :key="emp.id" :value="emp.id">
                        {{ emp.fullName }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldDescription>Employee responsible for this asset</FieldDescription>
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter v-if="!readOnly" class="border-t">
        <Field orientation="horizontal" class="w-full justify-end">
          <Button type="button" variant="outline" @click="resetForm()">Reset</Button>
          <Button type="submit" form="asset-form">Submit</Button>
        </Field>
      </CardFooter>
    </Card>
  </div>
</template>
