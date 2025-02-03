<template>
  <div
    class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full gap-4"
  >
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <StatBadge
        title="Current Blood Sugar"
        :value="mostRecentRecordWithinLastHour?.value.toString() ?? 'Unknown'"
        description="mg/dl"
      />
      <StatBadge
        title="In Range Streak"
        :value="`${percentTimeInRangeForFullDay.currentStreak.scoredDays.length} days`"
        description="at least 80% in range"
      />
      <StatBadge
        title="Current Daily Average"
        :value="averageInRangeForFullDay.currentScoredDayWithFallback?.scoreForDisplay || 'Unknown'"
        description="mg/dl"
      />
      <StatBadge
        title="Daily Average Streak"
        :value="`${averageInRangeForFullDay.currentStreak.scoredDays.length} days`"
        description="average within range"
      />
      <StatBadge
        title="Last Night"
        :value="`${percentTimeInRangeForNights.currentScoredDayWithFallback?.glucoseRecords.length || 'Unknown'}%`"
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
      :duration="noLowsStreaks.streakStringToDisplay"
      :data="noLowsStreaks.currentStreak"
      :low="thresholds.low"
      :best="noLowsStreaks.longestStreakString"
    />
    <LineGraph
      title="No Highs Streak"
      :duration="noHighsStreaks.streakStringToDisplay"
      :data="noHighsStreaks.currentStreak"
      :high="thresholds.high"
      :best="noHighsStreaks.longestStreakString"
    />
    <LineGraph
      title="No Highs or Lows Streak"
      :duration="noHighsOrLowsStreaks.streakStringToDisplay"
      :data="noHighsOrLowsStreaks.currentStreak"
      :low="thresholds.low"
      :high="thresholds.high"
      :best="noHighsOrLowsStreaks.longestStreakString"
    />
    <LineGraph
      title="Today's Time in Range"
      :duration="`${percentTimeInRangeForFullDay.currentScoredDayWithFallback?.scoreForDisplay || 'Unknown'}%`"
      :data="percentTimeInRangeForFullDay.currentScoredDayWithFallback?.glucoseRecords || []"
      :low="thresholds.low"
      :high="thresholds.high"
      :best="`${percentTimeInRangeForFullDay.bestDay ? percentTimeInRangeForFullDay.bestDay.scoreForDisplay : 'Unknown'}%`"
    />
    <LineGraph
      title="Last Night's Time in Range"
      :duration="`${percentTimeInRangeForNights.currentScoredDayWithFallback ? percentTimeInRangeForNights.currentScoredDayWithFallback.scoreForDisplay : 'Unknown'}%`"
      :data="percentTimeInRangeForNights.currentScoredDayWithFallback ? percentTimeInRangeForNights.currentScoredDayWithFallback.glucoseRecords : []"
      :low="thresholds.low"
      :high="thresholds.high"
      :best="`${percentTimeInRangeForNights.bestDay ? percentTimeInRangeForNights.bestDay.scoreForDisplay : 'Unknown'}%`"
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
  mostRecentRecordWithinLastHour,
  noHighsStreaks,
  noHighsOrLowsStreaks,
  noLowsStreaks,
  percentTimeInRangeForFullDay,
  percentTimeInRangeForNights,
} = useGlucoseValues(props.glucoseValues, props.thresholds)
</script>
