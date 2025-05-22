<template>
  <StatBadge
    title="Total % time in range"
    :value="valueString"
    icon-color="text-accent"
    description=""
    is-percentage
    :trend-stats="trendStats"
  />
</template>

<script setup lang="ts">
import { scoreRecordsByPercentTimeInRange } from '~/utils/scoring/percentTimeInRange/percentTimeInRange'
import { cleanPercentForDisplay } from '~/utils/formatting/percentFormatting'

const nuxtApp = useNuxtApp()
const glucoseValues = nuxtApp.$filteredGlucoseValues
const glucoseValuesForTrends = nuxtApp.$recordsForTrends
const thresholds = nuxtApp.$thresholds

const value = computed(() => {
  if (!glucoseValues.value.length) return 0
  return scoreRecordsByPercentTimeInRange(glucoseValues.value, thresholds.value)
})

const valueString = computed(() => {
  if (!glucoseValues.value.length) return 'N/A'

  return `${cleanPercentForDisplay(value.value)}%`
})

const trendValue = computed(() => {
  if (!glucoseValuesForTrends.value.length) return 0
  return scoreRecordsByPercentTimeInRange(glucoseValuesForTrends.value, thresholds.value)
})

const trendStats = computed(() => {
  const difference = value.value - trendValue.value
  const cleanDifference = Math.round(difference * 100) / 100
  const cleanTrendValue = Math.round(trendValue.value * 100) / 100
  return {
    trendScore: trendValue.value,
    trendScoreString: `${cleanTrendValue}%`,
    trendDifference: difference,
    trendString: `${cleanDifference > 0 ? '+' : ''}${cleanDifference}%`,
  }
})
</script>
