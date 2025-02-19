<template>
  <div class="grid grid-cols-1 xl:grid-cols-2 w-full items-center gap-4">
    <HistoryContiguousStreak
      title="No Highs or Lows Streaks"
      description="Longest streaks with no highs or lows"
      :streak-stats="scoredGames.contiguousStreakStats.noHighsOrLowsStreaks"
      :high-line="thresholdsToUse.high"
      :low-line="thresholdsToUse.low"
    />
    <HistoryContiguousStreak
      title="No Highs Streaks"
      description="Longest streaks with no highs"
      :streak-stats="scoredGames.contiguousStreakStats.noHighsStreaks"
      :high-line="thresholdsToUse.high"
    />
    <HistoryContiguousStreak
      title="No Lows Streaks"
      description="Longest streaks with no lows"
      :streak-stats="scoredGames.contiguousStreakStats.noLowsStreaks"
      :low-line="thresholdsToUse.low"
    />
    <HistoryDailyStreak
      title="In Range Streak"
      description="Consecutive full days with at least 80% time in range"
      score-label="Time in range"
      score-units="%"
      :streak-stats="scoredGames.dailyStreakStats.percentTimeInRangeForFullDay"
      :high-line="thresholdsToUse.high"
      :low-line="thresholdsToUse.low"
    />
    <HistoryDailyStreak
      title="Nighttime Streak"
      description="Consecutive nights with at least 80% time in range"
      score-label="Time in range"
      score-units="%"
      :streak-stats="scoredGames.dailyStreakStats.percentTimeInRangeForNights"
      :high-line="thresholdsToUse.high"
      :low-line="thresholdsToUse.low"
    />
    <HistoryDailyStreak
      title="Morning Streak"
      description="Consecutive mornings with at least 80% time in range"
      score-label="Time in range"
      score-units="%"
      :streak-stats="scoredGames.dailyStreakStats.percentTimeInRangeForMornings"
      :high-line="thresholdsToUse.high"
      :low-line="thresholdsToUse.low"
    />
    <HistoryDailyStreak
      title="Afternoon Streak"
      description="Consecutive afternoons with at least 80% time in range"
      score-label="Time in range"
      score-units="%"
      :streak-stats="scoredGames.dailyStreakStats.percentTimeInRangeForAfternoons"
      :high-line="thresholdsToUse.high"
      :low-line="thresholdsToUse.low"
    />
    <HistoryDailyStreak
      title="Evening Streak"
      description="Consecutive evenings with at least 80% time in range"
      score-label="Time in range"
      score-units="%"
      :streak-stats="scoredGames.dailyStreakStats.percentTimeInRangeForEvenings"
      :high-line="thresholdsToUse.high"
      :low-line="thresholdsToUse.low"
    />
    <HistoryDailyStreak
      title="Full Day Average in Range"
      description="Average glucose within range"
      score-label="Average Blood Glucose"
      score-units="mg/dL"
      :streak-stats="scoredGames.dailyStreakStats.averageInRangeForFullDay"
      :high-line="thresholdsToUse.high"
      :low-line="thresholdsToUse.low"
    />
    <HistoryDailyStreak
      title="Night Average in Range"
      description="Night time average glucose within range"
      score-label="Average Blood Glucose"
      score-units="mg/dL"
      :streak-stats="scoredGames.dailyStreakStats.averageInRangeForNights"
      :high-line="thresholdsToUse.high"
      :low-line="thresholdsToUse.low"
    />
    <HistoryDailyStreak
      title="Morning Average in Range"
      description="Morning average glucose within range"
      score-label="Average Blood Glucose"
      score-units="mg/dL"
      :streak-stats="scoredGames.dailyStreakStats.averageInRangeForMornings"
      :high-line="thresholdsToUse.high"
      :low-line="thresholdsToUse.low"
    />
    <HistoryDailyStreak
      title="Afternoon Average in Range"
      description="Afternoon average glucose within range"
      score-label="Average Blood Glucose"
      score-units="mg/dL"
      :streak-stats="scoredGames.dailyStreakStats.averageInRangeForAfternoons"
      :high-line="thresholdsToUse.high"
      :low-line="thresholdsToUse.low"
    />
    <HistoryDailyStreak
      title="Evening Average in Range"
      description="Evening average glucose within range"
      score-label="Average Blood Glucose"
      score-units="mg/dL"
      :streak-stats="scoredGames.dailyStreakStats.averageInRangeForEvenings"
      :high-line="thresholdsToUse.high"
      :low-line="thresholdsToUse.low"
    />
  </div>
</template>

<script setup lang="ts">
import { useGlucoseValues } from '~/composables/useGlucoseValues'
import type { GlucoseRecord } from '~/types/glucoseRecord'
import type { Thresholds } from '~/types/thresholds'

const props = defineProps<{
  thresholds?: Thresholds | undefined
  glucoseValues?: Ref<GlucoseRecord[]> | undefined
}>()

const {
  scoredGames,
} = useGlucoseValues(props.glucoseValues, props.thresholds)

const thresholdsToUse = computed(() => {
  if (props.thresholds) return props.thresholds
  return {
    low: 70,
    high: 180,
  }
})
</script>
