<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { increment, decrement } from './utils/counter'

/**
 * Count reactive reference
 */
const count = ref(0)

/**
 * Step reference.
 */
const step = ref(1)

// Handlers for Increment/Decrement/Clear
const handleIncrement = () => {
  count.value = increment(count.value, step.value)
}

const handleDecrement = () => {
  count.value = decrement(count.value, step.value)
}

const handleClear = () => {
  count.value = 0
}
</script>

<template>
  <div class="p-8 text-center max-w-sm mx-auto space-y-4 font-sans">
    <div class="flex flex-col items-start gap-2">
      <Label for="step">Step</Label>
      <Input id="step" v-model.number="step" type="number" />
    </div>

    <p class="text-xl font-bold">Counter: {{ count }}</p>

    <div class="flex justify-center gap-4">
      <Button @click="handleIncrement">Increment</Button>
      <Button @click="handleDecrement">Decrement</Button>
      <Button @click="handleClear">Clear</Button>
    </div>
  </div>
</template>
