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
        :value="`${percentTimeInRangeForFullDay.currentStreak.scoredDays.length} days`"
        description="at least 80% in range"
      />
      <StatBadge
        title="Current Daily Average"
        :value="averageInRangeForFullDay.todaysScoredDay.scoreForDisplay"
        description="mg/dl"
      />
      <StatBadge
        title="Daily Average Streak"
        :value="`${averageInRangeForFullDay.currentStreak.scoredDays.length} days`"
        description="average within range"
      />
      <StatBadge
        title="Last Night"
        :value="`${percentTimeInRangeForNights.todaysScoredDay.glucoseRecords.length > 0 ? percentTimeInRangeForNights.todaysScoredDay.scoreForDisplay : percentTimeInRangeForNights.mostRecentScoredDay?.scoreForDisplay || 0}%`"
        description="time in range"
      />
      <StatBadge
        title="Nighttime Streak"
        :value="`${percentTimeInRangeForNights.currentStreak.scoredDays.length} nights`"
        description="at least 80% in range"
      />
    </div>
    <LineGraph
      title="No Lows Streak"
      :duration="currentStreakWithoutLows.streakString"
      :data="currentStreakWithoutLows.longestStreak"
      :low="thresholds.low"
      :best="longestStreakWithoutLowsEver.streakString"
    />
    <LineGraph
      title="No Highs Streak"
      :duration="currentStreakWithoutHighs.streakString"
      :data="currentStreakWithoutHighs.longestStreak"
      :high="thresholds.high"
      :best="longestStreakWithoutHighsEver.streakString"
    />
    <LineGraph
      title="No Highs or Lows Streak"
      :duration="currentStreakWithoutHighsOrLows.streakString"
      :data="currentStreakWithoutHighsOrLows.longestStreak"
      :low="thresholds.low"
      :high="thresholds.high"
      :best="longestStreakWithoutLowsOrHighsEver.streakString"
    />
    <LineGraph
      title="Today's Time in Range"
      :duration="`${percentTimeInRangeForFullDay.todaysScoredDay.scoreForDisplay}%`"
      :data="percentTimeInRangeForFullDay.todaysScoredDay.glucoseRecords"
      :low="thresholds.low"
      :high="thresholds.high"
      :best="`${percentTimeInRangeForFullDay.bestDay.scoreForDisplay}%`"
    />
    <LineGraph
      title="Last Night's Time in Range"
      :duration="`${percentTimeInRangeForNights.todaysScoredDay.glucoseRecords.length > 0 ? percentTimeInRangeForNights.todaysScoredDay.scoreForDisplay : percentTimeInRangeForNights.mostRecentScoredDay?.scoreForDisplay || 0}%`"
      :data="percentTimeInRangeForNights.todaysScoredDay.glucoseRecords.length > 0 ? percentTimeInRangeForNights.todaysScoredDay.glucoseRecords : percentTimeInRangeForNights.mostRecentScoredDay?.glucoseRecords || []"
      :low="thresholds.low"
      :high="thresholds.high"
      :best="`${percentTimeInRangeForNights.bestDay.scoreForDisplay}%`"
    />
  </div>
</template>

<script setup lang="ts">
import type { GlucoseRecord } from '~/types/glucoseRecord'
import type { Thresholds } from '~/types/thresholds'

const props = defineProps<{
  thresholds: Thresholds
  glucoseValues?: Ref<GlucoseRecord[]> | undefined
}>()

const {
  averageInRangeForFullDay,
  currentStreakWithoutHighsOrLows,
  currentStreakWithoutLows,
  currentStreakWithoutHighs,
  longestStreakWithoutHighsEver,
  longestStreakWithoutLowsEver,
  longestStreakWithoutLowsOrHighsEver,
  mostRecentResult,
  percentTimeInRangeForFullDay,
  percentTimeInRangeForNights,
} = useGlucoseValues(props.glucoseValues)
</script>
