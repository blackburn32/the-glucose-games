<template>
  <div class="grid grid-cols-1 xl:grid-cols-2 w-full items-center gap-4  pt-[64px] p-[24px]">
    <HistoryContiguousStreak
      title="No Highs or Lows Streaks"
      description="Longest streaks with no highs or lows"
      :streak-stats="scoredGames.contiguousStreakStats.noHighsOrLowsStreaks"
      :high-line="thresholds.high"
      :low-line="thresholds.low"
    />
    <HistoryContiguousStreak
      title="No Highs Streaks"
      description="Longest streaks with no highs"
      :streak-stats="scoredGames.contiguousStreakStats.noHighsStreaks"
      :high-line="thresholds.high"
    />
    <HistoryContiguousStreak
      title="No Lows Streaks"
      description="Longest streaks with no lows"
      :streak-stats="scoredGames.contiguousStreakStats.noLowsStreaks"
      :low-line="thresholds.low"
    />
    <HistoryDailyStreak
      title="In Range Streak"
      :description="`Consecutive full days with at least ${thresholds.dailyStreakPercentTimeInRange}% time in range`"
      score-label="Time in range"
      score-units="%"
      :streak-stats="scoredGames.dailyStreakStats.percentTimeInRangeForSemanticPeriods[FullDayTiming.id]"
      :high-line="thresholds.high"
      :low-line="thresholds.low"
    />
    <HistoryDailyStreak
      title="Nighttime Streak"
      :description="`Consecutive nights with at least ${thresholds.dailyStreakPercentTimeInRange}% time in range`"
      score-label="Time in range"
      score-units="%"
      :streak-stats="scoredGames.dailyStreakStats.percentTimeInRangeForSemanticPeriods[NightTiming.id]"
      :high-line="thresholds.high"
      :low-line="thresholds.low"
    />
    <HistoryDailyStreak
      title="Morning Streak"
      :description="`Consecutive mornings with at least ${thresholds.dailyStreakPercentTimeInRange}% time in range`"
      score-label="Time in range"
      score-units="%"
      :streak-stats="scoredGames.dailyStreakStats.percentTimeInRangeForSemanticPeriods[MorningTiming.id]"
      :high-line="thresholds.high"
      :low-line="thresholds.low"
    />
    <HistoryDailyStreak
      title="Afternoon Streak"
      :description="`Consecutive afternoons with at least ${thresholds.dailyStreakPercentTimeInRange}% time in range`"
      score-label="Time in range"
      score-units="%"
      :streak-stats="scoredGames.dailyStreakStats.percentTimeInRangeForSemanticPeriods[AfternoonTiming.id]"
      :high-line="thresholds.high"
      :low-line="thresholds.low"
    />
    <HistoryDailyStreak
      title="Evening Streak"
      :description="`Consecutive evenings with at least ${thresholds.dailyStreakPercentTimeInRange}% time in range`"
      score-label="Time in range"
      score-units="%"
      :streak-stats="scoredGames.dailyStreakStats.percentTimeInRangeForSemanticPeriods[EveningTiming.id]"
      :high-line="thresholds.high"
      :low-line="thresholds.low"
    />
    <HistoryDailyStreak
      title="Full Day Average in Range"
      description="Average glucose within range"
      score-label="Average Blood Glucose"
      :score-units="unit"
      :streak-stats="scoredGames.dailyStreakStats.averageInRangeForSemanticPeriods[FullDayTiming.id]"
      :high-line="thresholds.high"
      :low-line="thresholds.low"
    />
    <HistoryDailyStreak
      title="Night Average in Range"
      description="Night time average glucose within range"
      score-label="Average Blood Glucose"
      :score-units="unit"
      :streak-stats="scoredGames.dailyStreakStats.averageInRangeForSemanticPeriods[NightTiming.id]"
      :high-line="thresholds.high"
      :low-line="thresholds.low"
    />
    <HistoryDailyStreak
      title="Morning Average in Range"
      description="Morning average glucose within range"
      score-label="Average Blood Glucose"
      :score-units="unit"
      :streak-stats="scoredGames.dailyStreakStats.averageInRangeForSemanticPeriods[MorningTiming.id]"
      :high-line="thresholds.high"
      :low-line="thresholds.low"
    />
    <HistoryDailyStreak
      title="Afternoon Average in Range"
      description="Afternoon average glucose within range"
      score-label="Average Blood Glucose"
      :score-units="unit"
      :streak-stats="scoredGames.dailyStreakStats.averageInRangeForSemanticPeriods[AfternoonTiming.id]"
      :high-line="thresholds.high"
      :low-line="thresholds.low"
    />
    <HistoryDailyStreak
      title="Evening Average in Range"
      description="Evening average glucose within range"
      score-label="Average Blood Glucose"
      :score-units="unit"
      :streak-stats="scoredGames.dailyStreakStats.averageInRangeForSemanticPeriods[EveningTiming.id]"
      :high-line="thresholds.high"
      :low-line="thresholds.low"
    />
  </div>
</template>

<script setup lang="ts">
import type { ScoredGlucoseGames } from '~/types/scoredGlucoseGames'
import type { Thresholds } from '~/types/thresholds'
import { FullDayTiming, NightTiming, MorningTiming, AfternoonTiming, EveningTiming } from '~/types/timing'

const nuxtApp = useNuxtApp()
const defaultScoredGames = nuxtApp.$scoredGames
const scoredGames = inject<Ref<ScoredGlucoseGames>>('scoredGamesInjectable', defaultScoredGames)
const defaultThresholds = nuxtApp.$thresholds
const thresholds = inject<Ref<Thresholds>>('thresholdsInjectable', defaultThresholds)

const { unit } = useDisplaySettings()
</script>
