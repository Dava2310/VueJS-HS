/**
 * Increments an already existing value.
 * @param value The existing value.
 * @param step The step to increment the value (default 1).
 * @returns The incremented value.
 */
export const increment = (value: number, step = 1) => {
  return (value += step);
};

/**
 * Decrements an already existing value.
 * @param value The existing value.
 * @param step The step to decrement the value (default 1).
 * @returns The decremented value.
 */
export const decrement = (value: number, step = 1) => {
  return (value -= step);
};
