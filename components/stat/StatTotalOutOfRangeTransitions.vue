<template>
  <StatBadge
    title="Total distinct highs and lows"
    :value="value.toString()"
    icon-color="text-accent"
    description=""
    :trend-stats="trendStats"
  />
</template>

<script setup lang="ts">
import { countOutOfRangeTransitions } from '~/utils/games/tally/outOfRange/outOfRangeGames'

const nuxtApp = useNuxtApp()
const glucoseValues = nuxtApp.$filteredGlucoseValues
const glucoseValuesForTrends = nuxtApp.$recordsForTrends
const thresholds = nuxtApp.$thresholds

const value = computed(() => {
  return countOutOfRangeTransitions(glucoseValues.value, thresholds.value)
})

const trendValue = computed(() => {
  return countOutOfRangeTransitions(glucoseValuesForTrends.value, thresholds.value)
})

const trendStats = computed(() => {
  const difference = value.value - trendValue.value
  return {
    trendScore: trendValue.value,
    trendScoreString: trendValue.value.toString(),
    trendDifference: difference * -1,
    trendString: `${difference > 0 ? '+' : ''}${difference}`,
  }
})
</script>
