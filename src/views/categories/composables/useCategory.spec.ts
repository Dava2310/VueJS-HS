import { describe, it, expect } from 'vitest';
import { categoryFormSchema, toCategoryVM } from './useCategory';
import type { CategoryResponseDto } from '@/api-client';

// ── Helpers ──────────────────────────────────────────────────────────────────

function validInput() {
  return { name: 'Laptops', code: 'lap-001', description: 'Portable computers' };
}

function makeDto(overrides: Partial<CategoryResponseDto> = {}): CategoryResponseDto {
  return {
    id: 1,
    name: 'Laptops',
    code: 'lap-001',
    description: 'Portable computers',
    createdAt: '2025-01-01T00:00:00.000Z',
    deletedAt: null,
    ...overrides,
  } as CategoryResponseDto;
}

// ── categoryFormSchema ────────────────────────────────────────────────────────

describe('categoryFormSchema', () => {
  describe('name', () => {
    it('rejects an empty name', () => {
      const result = categoryFormSchema.safeParse({ ...validInput(), name: '' });
      expect(result.success).toBe(false);
    });

    it('rejects a name longer than 100 characters', () => {
      const result = categoryFormSchema.safeParse({ ...validInput(), name: 'a'.repeat(101) });
      expect(result.success).toBe(false);
    });

    it('accepts a name of exactly 100 characters', () => {
      const result = categoryFormSchema.safeParse({ ...validInput(), name: 'a'.repeat(100) });
      expect(result.success).toBe(true);
    });
  });

  describe('code', () => {
    it('accepts a simple alphanumeric code', () => {
      const result = categoryFormSchema.safeParse({ ...validInput(), code: 'ABC123' });
      expect(result.success).toBe(true);
    });

    it('accepts a hyphen-separated code', () => {
      const result = categoryFormSchema.safeParse({ ...validInput(), code: 'cat-001' });
      expect(result.success).toBe(true);
    });

    it('rejects an empty code', () => {
      const result = categoryFormSchema.safeParse({ ...validInput(), code: '' });
      expect(result.success).toBe(false);
    });

    it('rejects a code longer than 32 characters', () => {
      const result = categoryFormSchema.safeParse({ ...validInput(), code: 'a'.repeat(33) });
      expect(result.success).toBe(false);
    });

    it('rejects a code with spaces', () => {
      const result = categoryFormSchema.safeParse({ ...validInput(), code: 'cat 001' });
      expect(result.success).toBe(false);
    });

    it('rejects a code with a leading hyphen', () => {
      const result = categoryFormSchema.safeParse({ ...validInput(), code: '-cat' });
      expect(result.success).toBe(false);
    });

    it('rejects a code with a trailing hyphen', () => {
      const result = categoryFormSchema.safeParse({ ...validInput(), code: 'cat-' });
      expect(result.success).toBe(false);
    });

    it('rejects a code with consecutive hyphens', () => {
      const result = categoryFormSchema.safeParse({ ...validInput(), code: 'cat--001' });
      expect(result.success).toBe(false);
    });
  });

  describe('description', () => {
    it('rejects an empty description', () => {
      const result = categoryFormSchema.safeParse({ ...validInput(), description: '' });
      expect(result.success).toBe(false);
    });

    it('rejects a description longer than 100 characters', () => {
      const result = categoryFormSchema.safeParse({
        ...validInput(),
        description: 'a'.repeat(101),
      });
      expect(result.success).toBe(false);
    });

    it('accepts a description of exactly 100 characters', () => {
      const result = categoryFormSchema.safeParse({
        ...validInput(),
        description: 'a'.repeat(100),
      });
      expect(result.success).toBe(true);
    });
  });
});

// ── toCategoryVM ─────────────────────────────────────────────────────────────

describe('toCategoryVM', () => {
  it('maps all fields from the DTO', () => {
    const dto = makeDto();
    const vm = toCategoryVM(dto);

    expect(vm.id).toBe('1');
    expect(vm.name).toBe('Laptops');
    expect(vm.code).toBe('lap-001');
    expect(vm.description).toBe('Portable computers');
    expect(vm.createdAt).toBe('2025-01-01T00:00:00.000Z');
  });

  it('sets status to Active when deletedAt is null', () => {
    const vm = toCategoryVM(makeDto({ deletedAt: null }));
    expect(vm.status).toBe('Active');
  });

  it('sets status to Inactive when deletedAt is set', () => {
    const vm = toCategoryVM(makeDto({ deletedAt: '2025-06-01T00:00:00.000Z' }));
    expect(vm.status).toBe('Inactive');
  });
});
