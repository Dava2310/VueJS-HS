<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm, Field as VeeField } from 'vee-validate';
import { useQueryClient } from '@tanstack/vue-query';
import { toast } from 'vue-sonner';
import { Plus } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group';
import {
  categoryFormSchema,
  categoriesQueryKey,
  createCategory,
  updateCategory,
  type CategoryVM,
  type CategoryFormValues,
} from '../composables/useCategory';

const props = defineProps<{
  category?: CategoryVM;
  open?: boolean;
  readOnly?: boolean;
}>();

const dialogOpen = defineModel<boolean>('open', { default: false });

const queryClient = useQueryClient();

const headline = props.readOnly
  ? 'View Category'
  : props.category
    ? 'Update Category'
    : 'Create Category';

const { handleSubmit, resetForm, values } = useForm<CategoryFormValues>({
  validationSchema: toTypedSchema(categoryFormSchema),
  initialValues: {
    name: props.category?.name ?? '',
    code: props.category?.code ?? '',
    description: props.category?.description ?? '',
  },
});

const onSubmit = handleSubmit((data) => {
  if (!props.category) {
    toast.promise(createCategory(data), {
      duration: 3000,
      loading: 'Loading...',
      success: ({ message, newData }: { message: string; newData: CategoryVM }) => {
        queryClient.setQueryData<CategoryVM[]>([...categoriesQueryKey], (prev) =>
          prev ? [...prev, newData] : [newData],
        );
        dialogOpen.value = false;
        return message;
      },
      error: (error: Error) => error.message,
    });
  } else {
    toast.promise(updateCategory(parseInt(props.category.id), data), {
      duration: 3000,
      loading: 'Loading...',
      success: ({ message, updatedData }: { message: string; updatedData: CategoryVM }) => {
        queryClient.setQueryData<CategoryVM[]>(
          [...categoriesQueryKey],
          (prev) => prev?.map((c) => (c.id === updatedData.id ? updatedData : c)) ?? prev,
        );
        dialogOpen.value = false;
        return message;
      },
      error: (error: Error) => error.message,
    });
  }
});
</script>

<template>
  <div class="self-end">
    <Dialog v-model:open="dialogOpen">
      <DialogTrigger v-if="!category" as-child>
        <Button type="button" class="gap-2 shadow-sm">
          <Plus data-icon="inline-start" />
          {{ headline }}
        </Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{{ headline }}</DialogTitle>
          <DialogDescription>Fill all the category necessary information</DialogDescription>
        </DialogHeader>
        <div class="-mx-4 no-scrollbar max-h-[80vh] overflow-y-auto px-4">
          <Card>
            <CardContent>
              <form id="category-form" @submit="onSubmit">
                <FieldGroup>
                  <VeeField v-slot="{ field, errors }" name="name">
                    <Field :data-invalid="!!errors.length">
                      <FieldLabel for="category-form-name">Category's Name</FieldLabel>
                      <Input
                        id="category-form-name"
                        :model-value="field.value"
                        :readonly="readOnly"
                        placeholder="Smartphones"
                        autocomplete="off"
                        :aria-invalid="!!errors.length"
                        @update:model-value="field.onChange"
                        @blur="field.onBlur"
                      />
                      <FieldError v-if="errors.length" :errors="errors" />
                    </Field>
                  </VeeField>

                  <VeeField v-slot="{ field, errors }" name="code">
                    <Field :data-invalid="!!errors.length">
                      <FieldLabel for="category-form-code">Category Code</FieldLabel>
                      <Input
                        id="category-form-code"
                        :model-value="field.value"
                        :readonly="readOnly"
                        placeholder="cat-123456"
                        autocomplete="off"
                        :aria-invalid="!!errors.length"
                        @update:model-value="field.onChange"
                        @blur="field.onBlur"
                      />
                      <FieldError v-if="errors.length" :errors="errors" />
                    </Field>
                  </VeeField>

                  <VeeField v-slot="{ field, errors }" name="description">
                    <Field :data-invalid="!!errors.length">
                      <FieldLabel for="category-form-description">Description</FieldLabel>
                      <InputGroup>
                        <InputGroupTextarea
                          id="category-form-description"
                          :model-value="field.value"
                          :readonly="readOnly"
                          placeholder="This is the asset's description category"
                          :rows="6"
                          class="min-h-24 resize-none"
                          :aria-invalid="!!errors.length"
                          @update:model-value="field.onChange"
                          @blur="field.onBlur"
                        />
                        <InputGroupAddon align="block-end">
                          <InputGroupText class="tabular-nums">
                            {{ values.description?.length ?? 0 }}/100 characters
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      <FieldError v-if="errors.length" :errors="errors" />
                    </Field>
                  </VeeField>
                </FieldGroup>
              </form>
            </CardContent>
            <CardFooter v-if="!readOnly">
              <Field orientation="horizontal">
                <Button type="button" variant="outline" @click="resetForm()">Reset</Button>
                <Button type="submit" form="category-form">Submit</Button>
              </Field>
            </CardFooter>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
