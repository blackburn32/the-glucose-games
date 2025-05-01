<template>
  <StatBadge
    title="Total % time in range"
    :value="value"
    icon-color="text-accent"
    description="throughout selected duration"
    is-percentage
  />
</template>

<script setup lang="ts">
import { scoreRecordsByPercentTimeInRange } from '~/utils/scoring/percentTimeInRange/percentTimeInRange'
import { cleanPercentForDisplay } from '~/utils/formatting/percentFormatting'

const nuxtApp = useNuxtApp()
const glucoseValues = nuxtApp.$glucoseValues
const thresholds = nuxtApp.$thresholds

const value = computed(() => {
  if (!glucoseValues.value.length) return 'N/A'
  const percent = scoreRecordsByPercentTimeInRange(glucoseValues.value, thresholds.value)
  return `${cleanPercentForDisplay(percent)}%`
})
</script>
