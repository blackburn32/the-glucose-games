<template>
  <DailyStreakBadge
    title="Daily Average Streak"
    description="average within range"
    :unit="unit"
    :streak-stats="scoredGames.dailyStreakStats.averageInRangeForFullDay"
  />
</template>

<script setup lang="ts">
import type { ScoredGlucoseGames } from '~/types/scoredGlucoseGames'

const nuxtApp = useNuxtApp()
const defaultScoredGames = nuxtApp.$scoredGames
const scoredGames = inject<Ref<ScoredGlucoseGames>>('scoredGamesInjectable', defaultScoredGames)
const { unit } = useDisplaySettings()
</script>
