<template>
  <div
    class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full gap-4"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-6">
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
    <LineGraph
      title="No Lows Streak"
      :duration="scoredGames.contiguousStreakStats.noLowsStreaks.streakStringToDisplay"
      :data="scoredGames.contiguousStreakStats.noLowsStreaks.currentStreak"
      :low="thresholds.low"
      :best="scoredGames.contiguousStreakStats.noLowsStreaks.longestStreakString"
    />
    <LineGraph
      title="No Highs Streak"
      :duration="scoredGames.contiguousStreakStats.noHighsStreaks.streakStringToDisplay"
      :data="scoredGames.contiguousStreakStats.noHighsStreaks.currentStreak"
      :high="thresholds.high"
      :best="scoredGames.contiguousStreakStats.noHighsStreaks.longestStreakString"
    />
    <LineGraph
      title="No Highs or Lows Streak"
      :duration="scoredGames.contiguousStreakStats.noHighsOrLowsStreaks.streakStringToDisplay"
      :data="scoredGames.contiguousStreakStats.noHighsOrLowsStreaks.currentStreak"
      :low="thresholds.low"
      :high="thresholds.high"
      :best="scoredGames.contiguousStreakStats.noHighsOrLowsStreaks.longestStreakString"
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
