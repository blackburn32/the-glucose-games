<template>
  <USelect
    v-model="modelValue"
    :items="durationOptions"
    variant="subtle"
    option-label="label"
    option-value="value"
    size="xl"
    class="min-w-[120px]"
    color="neutral"
    :ui="{
      base: 'ring-0 bg-base-200 focus:ring-0 focus-visible:ring-0 h-12 font-semibold px-[16px]',
    }"
  />
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'
import { ONE_MONTH, ONE_WEEK, THREE_MONTHS } from '~/types/constants'

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])

const durationOptions = [
  { label: 'Week', value: ONE_WEEK },
  { label: 'Month', value: ONE_MONTH },
  { label: '3 Months', value: THREE_MONTHS },
]

const modelValue = computed({
  get: () => props.modelValue,
  set: (val: number) => emit('update:modelValue', val),
})
</script>
