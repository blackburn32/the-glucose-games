<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
    <div class="flex flex-col space-y-4">
      <StatCurrentBloodGlucose />
      <StatCurrentTimeInRange />
      <StatCurrentDailyAverage />
      <StatCurrentStreakLength />
      <GameAverageInRangeDailyStreak />
      <GamePercentTimeInRangeDailyStreak />
    </div>
    <div class="md:col-span-2 grid grid-cols-1 gap-4">
      <ViewerWeeklyStreaks />
      <GameTimeInRangeViewer
        :games="scoredGames"
        :thresholds="thresholds"
      />
      <GameAverageInRangeViewer
        :games="scoredGames"
        :thresholds="thresholds"
      />
      <GameContiguousStreaksViewer
        :scored-games="scoredGames"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ScoredGlucoseGames } from '~/types/scoredGlucoseGames'
import type { Thresholds } from '~/types/thresholds'
import StatCurrentBloodGlucose from '~/components/stat/StatCurrentBloodGlucose.vue'
import StatCurrentDailyAverage from '~/components/stat/StatCurrentDailyAverage.vue'

const nuxtApp = useNuxtApp()
const defaultScoredGames = nuxtApp.$scoredGames
const scoredGames = inject<Ref<ScoredGlucoseGames>>('scoredGamesInjectable', defaultScoredGames)
const defaultThresholds = nuxtApp.$thresholds
const thresholds = inject<Ref<Thresholds>>('thresholdsInjectable', defaultThresholds)
</script>
