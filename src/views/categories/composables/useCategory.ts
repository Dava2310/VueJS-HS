import type { CategoryResponseDto, CreateCategoryDto, UpdateCategoryDto } from '@/api-client';
import { apiClient } from '@/lib/api-client';
import { throwError } from '@/lib/error-utils';
import * as z from 'zod';

// --- 1. TYPES (VM) ---
/**
 * Defines the view model for the Category entity in the Frontend.
 */
export interface CategoryVM {
  id: string;
  name: string;
  code: string;
  description: string;
  createdAt: string;
  status: 'Active' | 'Inactive';
}

// --- 2. FORM SCHEMA ---
export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters'),
  code: z
    .string()
    .trim()
    .min(1, 'Code is required')
    .max(32, 'Code must be at most 32 characters')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/i,
      'Code may only contain letters, numbers, and single hyphens between segments',
    ),
  description: z
    .string()
    .trim()
    .min(1, 'Description is required')
    .max(100, 'Description must be at most 100 characters'),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

// --- 4. MAPPERS ---
/**
 * Maps an object in DTO response format of CategoryResponseDto to CategoryVM format.
 * @param dto The DTO from the API.
 * @returns The object in view model format for the frontend.
 */
export const toCategoryVM = (dto: CategoryResponseDto): CategoryVM => ({
  id: dto.id.toString(),
  code: dto.code,
  description: dto.description,
  name: dto.name,
  status: dto.deletedAt ? 'Inactive' : 'Active',
  createdAt: dto.createdAt,
});

/**
 * Maps a list of DTOs response format of CategoryResponseDTO[] to CategoryVM[] format.
 * @param dtos The list of DTOs from the API.
 * @returns The list of objects in view model format for the frontend.
 */
export const toCategoryVMList = (dtos: CategoryResponseDto[]): CategoryVM[] =>
  dtos.map(toCategoryVM);

// --- 5. API CALLS ---
/** Vue Query key for the categories list — keep in sync with consumers. */
export const categoriesQueryKey = ['categories'] as const;

export const getCategories = async (): Promise<CategoryVM[]> => {
  try {
    const response = await apiClient.categories.categoriesControllerFindAll();
    return toCategoryVMList(response.data);
  } catch (error) {
    throwError(error, 'There was an error getting the list of categories.');
  }
};

export const getCategory = async (id: number): Promise<CategoryVM> => {
  try {
    const response = await apiClient.categories.categoriesControllerFindOne({ id });
    return toCategoryVM(response.data);
  } catch (error) {
    throwError(error, 'There was an error getting the data from the category.');
  }
};

export const createCategory = async (
  data: CreateCategoryDto,
): Promise<{ message: string; newData: CategoryVM }> => {
  try {
    const response = await apiClient.categories.categoriesControllerCreate({
      createCategoryDto: data,
    });
    const newData = toCategoryVM(response.data);
    return { message: 'Category created successfully.', newData };
  } catch (error) {
    throwError(error, 'There was an error creating the new category.');
  }
};

export const updateCategory = async (
  id: number,
  data: UpdateCategoryDto,
): Promise<{ message: string; updatedData: CategoryVM }> => {
  try {
    const response = await apiClient.categories.categoriesControllerUpdate({
      id,
      updateCategoryDto: data,
    });
    const updatedData = toCategoryVM(response.data);
    return { message: 'Category updated successfully.', updatedData };
  } catch (error) {
    throwError(error, 'There was an error updating the category.');
  }
};

export const deleteCategory = async (id: number): Promise<string> => {
  try {
    const response = await apiClient.categories.categoriesControllerRemove({ id });
    return response.data.message;
  } catch (error) {
    throwError(error, 'There was an error deleting the category.');
  }
};
