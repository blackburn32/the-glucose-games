<template>
  <VariableTimingLineGraph
    title-suffix=" time in range"
    :stats="stats"
    :semantic-periods="semanticPeriods"
    :low="thresholds.low"
    :high="thresholds.high"
    :provided-timing="providedTiming"
  />
</template>

<script setup lang="ts">
import type { ScoredGlucoseGames } from '~/types/scoredGlucoseGames'
import type { Thresholds } from '~/types/thresholds'

defineProps<{
  stats: boolean
  providedTiming?: number | undefined
}>()

const nuxtApp = useNuxtApp()
const defaultScoredGames = nuxtApp.$scoredGames
const scoredGames = inject<Ref<ScoredGlucoseGames>>('scoredGamesInjectable', defaultScoredGames)
const defaultThresholds = nuxtApp.$thresholds
const thresholds = inject<Ref<Thresholds>>('thresholdsInjectable', defaultThresholds)

const semanticPeriods = computed(() => {
  return scoredGames.value.dailyStreakStats.percentTimeInRangeForSemanticPeriods
})
</script>
