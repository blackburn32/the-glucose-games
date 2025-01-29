<template>
  <div class="grid grid-cols-1 xl:grid-cols-2 w-full items-center gap-4">
    <HistoryContiguousStreak
      title="No Highs or Lows Streaks"
      description="Longest streaks with no highs or lows"
      :streak-stats="noHighsOrLowsStreaks"
      :high-line="thresholds.high"
      :low-line="thresholds.low"
    />
    <HistoryContiguousStreak
      title="No Highs Streaks"
      description="Longest streaks with no highs"
      :streak-stats="noHighsStreaks"
      :high-line="thresholds.high"
    />
    <HistoryContiguousStreak
      title="No Lows Streaks"
      description="Longest streaks with no lows"
      :streak-stats="noLowsStreaks"
      :low-line="thresholds.low"
    />
    <HistoryDailyStreak
      title="In Range Streak"
      description="Consecutive full days with at least 80% time in range"
      score-label="Time in range"
      score-units="%"
      :streak-stats="percentTimeInRangeForFullDay"
      :high-line="thresholds.high"
      :low-line="thresholds.low"
    />
    <HistoryDailyStreak
      title="Nighttime Streak"
      description="Consecutive nights with at least 80% time in range"
      score-label="Time in range"
      score-units="%"
      :streak-stats="percentTimeInRangeForNights"
      :high-line="thresholds.high"
      :low-line="thresholds.low"
    />
    <HistoryDailyStreak
      title="Average in Range"
      description="Average glucose within range"
      score-label="Average Blood Glucose"
      score-units="mg/dl"
      :streak-stats="averageInRangeForFullDay"
      :high-line="thresholds.high"
      :low-line="thresholds.low"
    />
  </div>
</template>

<script setup lang="ts">
import { useGlucoseValues } from '~/composables/useGlucoseValues'
import { useThresholds } from '~/composables/useThresholds'
import type { GlucoseRecord } from '~/types/glucoseRecord'

const props = defineProps<{
  glucoseValues?: Ref<GlucoseRecord[]> | undefined
}>()

const {
  averageInRangeForFullDay,
  noHighsOrLowsStreaks,
  noHighsStreaks,
  noLowsStreaks,
  percentTimeInRangeForFullDay,
  percentTimeInRangeForNights,
} = useGlucoseValues(props.glucoseValues)

const thresholds = useThresholds()
</script>
