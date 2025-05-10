<template>
  <StatBadge
    title="Total distinct highs and lows"
    :value="value"
    icon-color="text-accent"
    description="throughout selected duration"
  />
</template>

<script setup lang="ts">
import { countOutOfRangeTransitions } from '~/utils/games/tally/outOfRange/outOfRangeGames'

const nuxtApp = useNuxtApp()
const glucoseValues = nuxtApp.$glucoseValues
const thresholds = nuxtApp.$thresholds

const value = computed(() => {
  return countOutOfRangeTransitions(glucoseValues.value, thresholds.value).toString()
})
</script>
