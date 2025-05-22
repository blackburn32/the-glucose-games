<template>
  <StatBadge
    title="Total average"
    :value="valueString"
    icon-color="text-accent"
    description=""
    :trend-stats="trendStats"
  />
</template>

<script setup lang="ts">
import { scoreRecordsByAverageGlucose } from '~/utils/scoring/averageGlucoseValue/averageGlucoseValue'

const nuxtApp = useNuxtApp()
const glucoseValues = nuxtApp.$filteredGlucoseValues
const glucoseValuesForTrends = nuxtApp.$recordsForTrends
const { getGlucoseValueWithUnit } = useDisplaySettings()
const thresholds = nuxtApp.$thresholds
const { unit } = useDisplaySettings()

const value = computed(() => {
  return scoreRecordsByAverageGlucose(glucoseValues.value)
})
const valueString = computed(() => {
  return getGlucoseValueWithUnit(value.value)
})

const trendValue = computed(() => {
  return scoreRecordsByAverageGlucose(glucoseValuesForTrends.value)
})

const trendStats = computed(() => {
  const cleanTrendValue = Math.round(trendValue.value * 100) / 100

  const valueComparedToTarget = Math.abs(value.value - thresholds.value.target)
  const trendValueComparedToTarget = Math.abs(trendValue.value - thresholds.value.target)
  const difference = trendValueComparedToTarget - valueComparedToTarget
  const cleanDifference = Math.abs(Math.round(difference * 100) / 100)
  return {
    trendScore: trendValueComparedToTarget,
    trendScoreString: `${cleanTrendValue}${unit.value}`,
    trendDifference: difference,
    trendString: `${difference > 0 ? '-' : '+'}${cleanDifference}${unit.value}`,
    trendTooltip: `${cleanDifference}${unit.value} ${difference < 0 ? 'farther from' : 'closer to'} your target than the period before`,
  }
})
</script>
