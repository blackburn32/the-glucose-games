<template>
  <div
    class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full gap-4"
  >
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <StatBadge
        title="Current Blood Sugar"
        :value="mostRecentResult?.value.toString() ?? 'N/A'"
        description="mg/dl"
      />
      <StatBadge
        title="In Range Streak"
        :value="`${currentStreakOfDaysWithinRange.streak.length.toString()} days`"
        description="at least 80% in range"
      />
      <StatBadge
        title="Current Daily Average"
        :value="currentDailyAverage?.toFixed(2) ?? 'N/A'"
        description="mg/dl"
      />
      <StatBadge
        title="Daily Average Streak"
        :value="`${currentStreakOfDailyAveragesWithinRange.streak.length.toString()} days`"
        description="average within range"
      />
      <StatBadge
        title="Last Night"
        :value="`${lastNight.cleanPercentTimeInRange}%`"
        description="time in range"
      />
      <StatBadge
        title="Nighttime Streak"
        :value="`${currentStreakOfNightsWithinRange.streak.length.toString()} nights`"
        description="at least 80% in range"
      />
    </div>
    <LineGraph
      title="No Lows Streak"
      :duration="currentStreakWithoutLows.streakString"
      :data="currentStreakWithoutLows.longestStreak"
      :low="thresholds.low"
    />
    <LineGraph
      title="No Highs Streak"
      :duration="currentStreakWithoutHighs.streakString"
      :data="currentStreakWithoutHighs.longestStreak"
      :high="thresholds.high"
    />
    <LineGraph
      title="No Highs or Lows Streak"
      :duration="currentStreakWithoutHighsOrLows.streakString"
      :data="currentStreakWithoutHighsOrLows.longestStreak"
      :low="thresholds.low"
      :high="thresholds.high"
    />
    <LineGraph
      title="Today's Time in Range"
      :duration="`${today.cleanPercentTimeInRange}%`"
      :data="today.glucoseValues"
      :low="thresholds.low"
      :high="thresholds.high"
    />
    <LineGraph
      title="Last Night's Time in Range"
      :duration="`${lastNight.cleanPercentTimeInRange}%`"
      :data="lastNight.glucoseValues"
      :low="thresholds.low"
      :high="thresholds.high"
    />
  </div>
</template>

<script setup lang="ts">
import type { GlucoseRecord } from '~/types/types'

const props = defineProps<{
  thresholds: Thresholds
  glucoseValues?: Ref<GlucoseRecord[]> | undefined
}>()

const {
  currentDailyAverage,
  currentStreakOfDailyAveragesWithinRange,
  currentStreakOfDaysWithinRange,
  currentStreakOfNightsWithinRange,
  currentStreakWithoutHighsOrLows,
  currentStreakWithoutLows,
  currentStreakWithoutHighs,
  lastNight,
  mostRecentResult,
  today,
} = useGlucoseValues(props.glucoseValues)
</script>
