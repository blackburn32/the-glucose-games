<template>
  <StatBadge
    title="Total average"
    :value="value"
    icon-color="text-accent"
    description="throughout selected duration"
  />
</template>

<script setup lang="ts">
import { scoreRecordsByAverageGlucose } from '~/utils/scoring/averageGlucoseValue/averageGlucoseValue'

const nuxtApp = useNuxtApp()
const glucoseValues = nuxtApp.$glucoseValues
const { getGlucoseValueWithUnit } = useDisplaySettings()

const value = computed(() => {
  if (!glucoseValues.value.length) return 'N/A'
  const avg = scoreRecordsByAverageGlucose(glucoseValues.value)
  return getGlucoseValueWithUnit(avg)
})
</script>
