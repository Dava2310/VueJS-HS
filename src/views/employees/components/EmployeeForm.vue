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
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  employeesFormSchema,
  employeesQueryKey,
  createEmployee,
  updateEmployee,
  type EmployeeVM,
  type EmployeeFormValues,
} from '../composables/useEmployee';

const props = defineProps<{
  employee?: EmployeeVM;
  open?: boolean;
  readOnly?: boolean;
}>();

const dialogOpen = defineModel<boolean>('open', { default: false });

const queryClient = useQueryClient();

const headline = props.readOnly
  ? 'View Employee'
  : props.employee
    ? 'Update Employee'
    : 'Create Employee';

const { handleSubmit, resetForm } = useForm<EmployeeFormValues>({
  validationSchema: toTypedSchema(employeesFormSchema),
  initialValues: {
    fullName: props.employee?.fullName ?? '',
    employeeCode: props.employee?.employeeCode ?? '',
    email: props.employee?.email ?? '',
    password: '',
    roleId: '1',
  },
});

const onSubmit = handleSubmit((data) => {
  if (!props.employee) {
    toast.promise(createEmployee({ ...data, roleId: parseInt(data.roleId) }), {
      duration: 3000,
      loading: 'Loading...',
      success: ({ message, newData }: { message: string; newData: EmployeeVM }) => {
        queryClient.setQueryData<EmployeeVM[]>([...employeesQueryKey], (prev) =>
          prev ? [...prev, newData] : [newData],
        );
        dialogOpen.value = false;
        return message;
      },
      error: (error: Error) => error.message,
    });
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...rest } = data;
    toast.promise(
      updateEmployee(parseInt(props.employee.id), { ...rest, roleId: parseInt(rest.roleId) }),
      {
        duration: 3000,
        loading: 'Loading...',
        success: ({ message, updatedData }: { message: string; updatedData: EmployeeVM }) => {
          queryClient.setQueryData<EmployeeVM[]>(
            [...employeesQueryKey],
            (prev) => prev?.map((e) => (e.id === updatedData.id ? updatedData : e)) ?? prev,
          );
          dialogOpen.value = false;
          return message;
        },
        error: (error: Error) => error.message,
      },
    );
  }
});
</script>

<template>
  <div class="self-end">
    <Dialog v-model:open="dialogOpen">
      <DialogTrigger v-if="!employee" as-child>
        <Button type="button" class="gap-2 shadow-sm">
          <Plus data-icon="inline-start" />
          {{ headline }}
        </Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{{ headline }}</DialogTitle>
          <DialogDescription>Fill all the employee necessary information</DialogDescription>
        </DialogHeader>
        <div class="-mx-4 no-scrollbar max-h-[80vh] overflow-y-auto px-4">
          <Card>
            <CardContent>
              <form id="employee-form" @submit="onSubmit">
                <FieldGroup>
                  <VeeField v-slot="{ field, errors }" name="fullName">
                    <Field :data-invalid="!!errors.length">
                      <FieldLabel for="employee-form-full-name">Employee Full Name</FieldLabel>
                      <Input
                        id="employee-form-full-name"
                        :model-value="field.value"
                        :readonly="readOnly"
                        placeholder="Daniel Alberto Vetencourt Alvarez"
                        autocomplete="off"
                        :aria-invalid="!!errors.length"
                        @update:model-value="field.onChange"
                        @blur="field.onBlur"
                      />
                      <FieldError v-if="errors.length" :errors="errors" />
                    </Field>
                  </VeeField>

                  <VeeField v-slot="{ field, errors }" name="email">
                    <Field :data-invalid="!!errors.length">
                      <FieldLabel for="employee-form-email">Email</FieldLabel>
                      <Input
                        id="employee-form-email"
                        :model-value="field.value"
                        :readonly="readOnly"
                        placeholder="example@gmail.com"
                        autocomplete="off"
                        :aria-invalid="!!errors.length"
                        @update:model-value="field.onChange"
                        @blur="field.onBlur"
                      />
                      <FieldDescription>Personal or corporative employee email</FieldDescription>
                      <FieldError v-if="errors.length" :errors="errors" />
                    </Field>
                  </VeeField>

                  <VeeField v-slot="{ field, errors }" name="employeeCode">
                    <Field :data-invalid="!!errors.length">
                      <FieldLabel for="employee-form-employee-code">Employee Code</FieldLabel>
                      <Input
                        id="employee-form-employee-code"
                        :model-value="field.value"
                        :readonly="readOnly"
                        placeholder="ABCDE12345"
                        autocomplete="off"
                        :aria-invalid="!!errors.length"
                        @update:model-value="field.onChange"
                        @blur="field.onBlur"
                      />
                      <FieldError v-if="errors.length" :errors="errors" />
                    </Field>
                  </VeeField>

                  <VeeField v-if="!employee" v-slot="{ field, errors }" name="password">
                    <Field :data-invalid="!!errors.length">
                      <FieldLabel for="employee-form-password">Employee Password</FieldLabel>
                      <Input
                        id="employee-form-password"
                        :model-value="field.value"
                        :readonly="readOnly"
                        type="password"
                        autocomplete="off"
                        :aria-invalid="!!errors.length"
                        @update:model-value="field.onChange"
                        @blur="field.onBlur"
                      />
                      <FieldError v-if="errors.length" :errors="errors" />
                    </Field>
                  </VeeField>

                  <VeeField v-slot="{ field, errors }" name="roleId">
                    <Field :data-invalid="!!errors.length">
                      <FieldLabel for="employee-form-role-id">Role ID</FieldLabel>
                      <Input
                        id="employee-form-role-id"
                        :model-value="field.value"
                        :readonly="readOnly"
                        autocomplete="off"
                        :aria-invalid="!!errors.length"
                        @update:model-value="field.onChange"
                        @blur="field.onBlur"
                      />
                      <FieldError v-if="errors.length" :errors="errors" />
                    </Field>
                  </VeeField>
                </FieldGroup>
              </form>
            </CardContent>
            <CardFooter v-if="!readOnly">
              <Field orientation="horizontal">
                <Button type="button" variant="outline" @click="resetForm()">Reset</Button>
                <Button type="submit" form="employee-form">Submit</Button>
              </Field>
            </CardFooter>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
