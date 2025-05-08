<template>
  <USelect
    v-model="modelValue"
    :items="timeOfDayOptions"
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
import { FullDayTiming, NightTiming, MorningTiming, AfternoonTiming, EveningTiming } from '~/types/timing'

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])

const timeOfDayOptions = [
  { label: 'Full day', value: FullDayTiming.id },
  { label: 'Night', value: NightTiming.id },
  { label: 'Morning', value: MorningTiming.id },
  { label: 'Afternoon', value: AfternoonTiming.id },
  { label: 'Evening', value: EveningTiming.id },
]

const modelValue = computed({
  get: () => props.modelValue,
  set: (val: string) => emit('update:modelValue', val),
})
</script>
