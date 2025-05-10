<template>
  <DailyStreakBadge
    title="Daily Average Streak"
    description="average within range"
    :unit="unit"
    :streak-stats="dailyStreakStats"
    :best="dailyStreakStats.bestStreakIncludesToday"
  />
</template>

<script setup lang="ts">
import type { ScoredGlucoseGames } from '~/types/scoredGlucoseGames'
import { FullDayTiming } from '~/types/timing'

const nuxtApp = useNuxtApp()
const defaultScoredGames = nuxtApp.$scoredGames
const scoredGames = inject<Ref<ScoredGlucoseGames>>('scoredGamesInjectable', defaultScoredGames)
const { unit } = useDisplaySettings()

const dailyStreakStats = computed(
  () => scoredGames.value.dailyStreakStats.averageInRangeForSemanticPeriods[FullDayTiming.id],
)
</script>
