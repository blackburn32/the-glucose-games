<template>
  <div
    class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full gap-4"
  >
    <div class="grid grid-cols-2 xl:grid-cols-3 gap-4">
      <StatBadge
        title="Daily Average"
        :value="averageInRangeForFullDay.currentScoredDayWithFallback?.scoreForDisplay || 'Unknown'"
        :icon="getIconForStatus(averageInRangeForFullDay.currentStreak.currentDayStatus)"
        :icon-color="getColorForStatus(averageInRangeForFullDay.currentStreak.currentDayStatus)"
        description="mg/dL"
      />
      <StatBadge
        title="Today"
        :value="`${percentTimeInRangeForFullDay.currentScoredDayWithFallback?.scoreForDisplay}%` || 'Unknown'"
        :icon="getIconForStatus(percentTimeInRangeForFullDay.currentStreak.currentDayStatus)"
        :icon-color="getColorForStatus(percentTimeInRangeForFullDay.currentStreak.currentDayStatus)"
        description="time in range"
      />
      <StatBadge
        title="Last Night"
        :value="`${percentTimeInRangeForNights.currentScoredDayWithFallback?.scoreForDisplay || 'Unknown'}%`"
        :icon="getIconForStatus(percentTimeInRangeForNights.currentStreak.currentDayStatus)"
        :icon-color="getColorForStatus(percentTimeInRangeForNights.currentStreak.currentDayStatus)"
        description="time in range"
      />
      <StatBadge
        title="Daily Average Streak"
        :value="`${averageInRangeForFullDay.currentStreak.scoredDays.length} days`"
        :icon="getIconForDailyStreak(averageInRangeForFullDay.currentStreak.scoredDays.length)"
        :icon-color="getColorForDailyStreak(averageInRangeForFullDay.currentStreak.scoredDays.length)"
        description="average within range"
      />
      <StatBadge
        title="In Range Streak"
        :value="`${percentTimeInRangeForFullDay.currentStreak.scoredDays.length} days`"
        :icon="getIconForDailyStreak(percentTimeInRangeForFullDay.currentStreak.scoredDays.length)"
        :icon-color="getColorForDailyStreak(percentTimeInRangeForFullDay.currentStreak.scoredDays.length)"
        description="at least 80% in range"
      />
      <StatBadge
        title="Nighttime Streak"
        :value="`${percentTimeInRangeForNights.currentStreak.scoredDays.length} days`"
        :icon="getIconForDailyStreak(percentTimeInRangeForNights.currentStreak.scoredDays.length)"
        :icon-color="getColorForDailyStreak(percentTimeInRangeForNights.currentStreak.scoredDays.length)"
        description="at least 80% in range"
      />
      <StatBadge
        title="Morning Streak"
        :value="`${percentTimeInRangeForMornings.currentStreak.scoredDays.length} days`"
        :icon="getIconForDailyStreak(percentTimeInRangeForMornings.currentStreak.scoredDays.length)"
        :icon-color="getColorForDailyStreak(percentTimeInRangeForMornings.currentStreak.scoredDays.length)"
        description="at least 80% in range"
      />
      <StatBadge
        title="Afternoon Streak"
        :value="`${percentTimeInRangeForAfternoons.currentStreak.scoredDays.length} days`"
        :icon="getIconForDailyStreak(percentTimeInRangeForAfternoons.currentStreak.scoredDays.length)"
        :icon-color="getColorForDailyStreak(percentTimeInRangeForAfternoons.currentStreak.scoredDays.length)"
        description="at least 80% in range"
      />
      <StatBadge
        title="Evening Streak"
        :value="`${percentTimeInRangeForEvenings.currentStreak.scoredDays.length} days`"
        :icon="getIconForDailyStreak(percentTimeInRangeForEvenings.currentStreak.scoredDays.length)"
        :icon-color="getColorForDailyStreak(percentTimeInRangeForEvenings.currentStreak.scoredDays.length)"
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
    <LineGraph
      title="This Morning's Time in Range"
      :duration="`${percentTimeInRangeForMornings.currentScoredDayWithFallback ? percentTimeInRangeForMornings.currentScoredDayWithFallback.scoreForDisplay : 'Unknown'}%`"
      :data="percentTimeInRangeForMornings.currentScoredDayWithFallback ? percentTimeInRangeForMornings.currentScoredDayWithFallback.glucoseRecords : []"
      :low="thresholds.low"
      :high="thresholds.high"
      :best="`${percentTimeInRangeForMornings.bestDay ? percentTimeInRangeForMornings.bestDay.scoreForDisplay : 'Unknown'}%`"
    />
    <LineGraph
      title="This Afternoon's Time in Range"
      :duration="`${percentTimeInRangeForAfternoons.currentScoredDayWithFallback ? percentTimeInRangeForAfternoons.currentScoredDayWithFallback.scoreForDisplay : 'Unknown'}%`"
      :data="percentTimeInRangeForAfternoons.currentScoredDayWithFallback ? percentTimeInRangeForAfternoons.currentScoredDayWithFallback.glucoseRecords : []"
      :low="thresholds.low"
      :high="thresholds.high"
      :best="`${percentTimeInRangeForAfternoons.bestDay ? percentTimeInRangeForAfternoons.bestDay.scoreForDisplay : 'Unknown'}%`"
    />
    <LineGraph
      title="This Evening's Time in Range"
      :duration="`${percentTimeInRangeForEvenings.currentScoredDayWithFallback ? percentTimeInRangeForEvenings.currentScoredDayWithFallback.scoreForDisplay : 'Unknown'}%`"
      :data="percentTimeInRangeForEvenings.currentScoredDayWithFallback ? percentTimeInRangeForEvenings.currentScoredDayWithFallback.glucoseRecords : []"
      :low="thresholds.low"
      :high="thresholds.high"
      :best="`${percentTimeInRangeForEvenings.bestDay ? percentTimeInRangeForEvenings.bestDay.scoreForDisplay : 'Unknown'}%`"
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
  noHighsStreaks,
  noHighsOrLowsStreaks,
  noLowsStreaks,
  percentTimeInRangeForAfternoons,
  percentTimeInRangeForEvenings,
  percentTimeInRangeForFullDay,
  percentTimeInRangeForMornings,
  percentTimeInRangeForNights,
} = useGlucoseValues(props.glucoseValues, props.thresholds)
</script>
