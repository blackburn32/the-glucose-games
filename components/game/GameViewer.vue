<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
    <div class="flex flex-col space-y-4">
      <GameAverageInRangeDailyStreak />
      <GamePercentTimeInRangeDailyStreak />
      <DailyStreakBadge
        title="Nighttime Streak"
        :description="`at least ${thresholds.dailyStreakPercentTimeInRange}% in range`"
        unit="%"
        :streak-stats="scoredGames.dailyStreakStats.percentTimeInRangeForNights"
      />
      <DailyStreakBadge
        title="Morning Streak"
        :description="`at least ${thresholds.dailyStreakPercentTimeInRange}% in range`"
        unit="%"
        :streak-stats="scoredGames.dailyStreakStats.percentTimeInRangeForMornings"
      />
      <DailyStreakBadge
        title="Afternoon Streak"
        :description="`at least ${thresholds.dailyStreakPercentTimeInRange}% in range`"
        unit="%"
        :streak-stats="scoredGames.dailyStreakStats.percentTimeInRangeForAfternoons"
      />
      <DailyStreakBadge
        title="Evening Streak"
        :description="`at least ${thresholds.dailyStreakPercentTimeInRange}% in range`"
        unit="%"
        :streak-stats="scoredGames.dailyStreakStats.percentTimeInRangeForEvenings"
      />
    </div>
    <div class="md:col-span-2 grid grid-cols-1 gap-4">
      <ViewerWeeklyStreaks />
      <GameContiguousStreaksViewer
        :scored-games="scoredGames"
      />
      <GameTimeInRangeViewer
        :games="scoredGames"
        :thresholds="thresholds"
      />
      <GameAverageInRangeViewer
        :games="scoredGames"
        :thresholds="thresholds"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ScoredGlucoseGames } from '~/types/scoredGlucoseGames'
import type { Thresholds } from '~/types/thresholds'

const nuxtApp = useNuxtApp()
const defaultScoredGames = nuxtApp.$scoredGames
const scoredGames = inject<Ref<ScoredGlucoseGames>>('scoredGamesInjectable', defaultScoredGames)
const defaultThresholds = nuxtApp.$thresholds
const thresholds = inject<Ref<Thresholds>>('thresholdsInjectable', defaultThresholds)
</script>
