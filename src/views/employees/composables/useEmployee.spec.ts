import { describe, it, expect } from 'vitest';
import { employeesFormSchema, toEmployeeVM, toEmployeeVMList } from './useEmployee';
import type { EmployeeResponseDto } from '@/api-client';

// ── Helpers ──────────────────────────────────────────────────────────────────

function validInput() {
  return {
    fullName: 'Jane Doe',
    employeeCode: 'EMP0000001',
    email: 'jane@example.com',
    password: 'secret99',
    roleId: '1',
  };
}

function makeDto(overrides: Partial<EmployeeResponseDto> = {}): EmployeeResponseDto {
  return {
    id: 1,
    fullName: 'Jane Doe',
    employeeCode: 'EMP0000001',
    email: 'jane@example.com',
    createdAt: '2025-01-01T00:00:00.000Z',
    deletedAt: null,
    ...overrides,
  } as EmployeeResponseDto;
}

// ── employeesFormSchema ───────────────────────────────────────────────────────

describe('employeesFormSchema', () => {
  describe('fullName', () => {
    it('rejects a name shorter than 2 characters', () => {
      const result = employeesFormSchema.safeParse({ ...validInput(), fullName: 'A' });
      expect(result.success).toBe(false);
    });

    it('rejects a name longer than 120 characters', () => {
      const result = employeesFormSchema.safeParse({ ...validInput(), fullName: 'A'.repeat(121) });
      expect(result.success).toBe(false);
    });

    it('accepts names with accented characters', () => {
      const result = employeesFormSchema.safeParse({ ...validInput(), fullName: 'José García' });
      expect(result.success).toBe(true);
    });

    it('accepts names with apostrophes, hyphens, and dots', () => {
      const result = employeesFormSchema.safeParse({
        ...validInput(),
        fullName: "O'Brien-Smith Jr.",
      });
      expect(result.success).toBe(true);
    });

    it('rejects a name with digits', () => {
      const result = employeesFormSchema.safeParse({ ...validInput(), fullName: 'Jane123' });
      expect(result.success).toBe(false);
    });
  });

  describe('employeeCode', () => {
    it('accepts an exactly 10-character alphanumeric code', () => {
      const result = employeesFormSchema.safeParse({ ...validInput(), employeeCode: 'ABC1234567' });
      expect(result.success).toBe(true);
    });

    it('rejects a code shorter than 10 characters', () => {
      const result = employeesFormSchema.safeParse({ ...validInput(), employeeCode: 'SHORT' });
      expect(result.success).toBe(false);
    });

    it('rejects a code longer than 10 characters', () => {
      const result = employeesFormSchema.safeParse({
        ...validInput(),
        employeeCode: 'TOOLONGCODE',
      });
      expect(result.success).toBe(false);
    });

    it('rejects a code with special characters', () => {
      const result = employeesFormSchema.safeParse({ ...validInput(), employeeCode: 'ABC-123456' });
      expect(result.success).toBe(false);
    });
  });

  describe('email', () => {
    it('rejects a missing @ symbol', () => {
      const result = employeesFormSchema.safeParse({ ...validInput(), email: 'notanemail' });
      expect(result.success).toBe(false);
    });

    it('rejects an empty email', () => {
      const result = employeesFormSchema.safeParse({ ...validInput(), email: '' });
      expect(result.success).toBe(false);
    });
  });

  describe('password', () => {
    it('accepts an empty password (update mode — field is omitted)', () => {
      const result = employeesFormSchema.safeParse({ ...validInput(), password: '' });
      expect(result.success).toBe(true);
    });

    it('accepts a password of 8 or more characters', () => {
      const result = employeesFormSchema.safeParse({ ...validInput(), password: '12345678' });
      expect(result.success).toBe(true);
    });

    it('rejects a password between 1 and 7 characters', () => {
      const result = employeesFormSchema.safeParse({ ...validInput(), password: 'short' });
      expect(result.success).toBe(false);
    });
  });

  describe('roleId', () => {
    it('accepts a positive numeric string', () => {
      const result = employeesFormSchema.safeParse({ ...validInput(), roleId: '2' });
      expect(result.success).toBe(true);
    });

    it('rejects an empty roleId', () => {
      const result = employeesFormSchema.safeParse({ ...validInput(), roleId: '' });
      expect(result.success).toBe(false);
    });

    it('rejects a non-numeric roleId', () => {
      const result = employeesFormSchema.safeParse({ ...validInput(), roleId: 'admin' });
      expect(result.success).toBe(false);
    });

    it('rejects zero', () => {
      const result = employeesFormSchema.safeParse({ ...validInput(), roleId: '0' });
      expect(result.success).toBe(false);
    });
  });
});

// ── toEmployeeVM ─────────────────────────────────────────────────────────────

describe('toEmployeeVM', () => {
  it('maps all fields from the DTO', () => {
    const dto = makeDto();
    const vm = toEmployeeVM(dto);

    expect(vm.id).toBe('1');
    expect(vm.fullName).toBe('Jane Doe');
    expect(vm.employeeCode).toBe('EMP0000001');
    expect(vm.email).toBe('jane@example.com');
    expect(vm.createdAt).toBe('2025-01-01T00:00:00.000Z');
  });

  it('sets status to Active when deletedAt is null', () => {
    const vm = toEmployeeVM(makeDto({ deletedAt: null }));
    expect(vm.status).toBe('Active');
  });

  it('sets status to Inactive when deletedAt is set', () => {
    const vm = toEmployeeVM(makeDto({ deletedAt: '2025-06-01T00:00:00.000Z' }));
    expect(vm.status).toBe('Inactive');
  });
});

// ── toEmployeeVMList ──────────────────────────────────────────────────────────

describe('toEmployeeVMList', () => {
  it('maps every DTO in the list', () => {
    const dtos = [makeDto({ id: 1 }), makeDto({ id: 2, fullName: 'John Smith' })];
    const vms = toEmployeeVMList(dtos);

    expect(vms).toHaveLength(2);
    expect(vms[0].id).toBe('1');
    expect(vms[1].fullName).toBe('John Smith');
  });

  it('returns an empty array for an empty input', () => {
    expect(toEmployeeVMList([])).toEqual([]);
  });
});
