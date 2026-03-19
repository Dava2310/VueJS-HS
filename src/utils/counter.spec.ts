import { describe, it, expect } from 'vitest';
import { decrement, increment } from './counter';

describe('Counter Unit Testing', () => {
  // Incrementing unit testing
  describe('Increment function', () => {
    it('Incrementing with step default value', () => {
      expect(increment(5)).toBe(6);
    });

    it('Incrementing with a non-default step value', () => {
      expect(increment(10, 2)).toBe(12);
    });

    it('Incrementing with negative values', () => {
      expect(increment(5, -6)).toBe(-1);
    });
  });

  // Decrementing unit testing
  describe('Decrement function', () => {
    it('Decrementing with step default value', () => {
      expect(decrement(8)).toBe(7);
    });

    it('Decrementing with a non-default step value', () => {
      expect(decrement(8, 3)).toBe(5);
    });

    it('Decrementing with negative values', () => {
      expect(decrement(6, -6)).toBe(12);
    });
  });
});
