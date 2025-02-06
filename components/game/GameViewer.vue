<template>
  <div
    class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full gap-4"
  >
    <div class="grid grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-6">
      <StatBadge
        title="Daily Average"
        :value="scoredGames.dailyStreakStats.averageInRangeForFullDay.currentScoredDayWithFallback?.scoreForDisplay || 'Unknown'"
        :icon="getIconForStatus(scoredGames.dailyStreakStats.averageInRangeForFullDay.currentStreak.currentDayStatus)"
        :icon-color="getColorForStatus(scoredGames.dailyStreakStats.averageInRangeForFullDay.currentStreak.currentDayStatus)"
        description="mg/dL"
      />
      <StatBadge
        title="Today"
        :value="`${scoredGames.dailyStreakStats.percentTimeInRangeForFullDay.currentScoredDayWithFallback?.scoreForDisplay}%` || 'Unknown'"
        :icon="getIconForStatus(scoredGames.dailyStreakStats.percentTimeInRangeForFullDay.currentStreak.currentDayStatus)"
        :icon-color="getColorForStatus(scoredGames.dailyStreakStats.percentTimeInRangeForFullDay.currentStreak.currentDayStatus)"
        :best="scoredGames.dailyStreakStats.percentTimeInRangeForFullDay.bestDay && (scoredGames.dailyStreakStats.percentTimeInRangeForFullDay.currentScoredDayWithFallback?.score ?? 0) >= scoredGames.dailyStreakStats.percentTimeInRangeForFullDay.bestDay.score"
        description="time in range"
      />
      <StatBadge
        title="Last Night"
        :value="`${scoredGames.dailyStreakStats.percentTimeInRangeForNights.currentScoredDayWithFallback?.scoreForDisplay || 'Unknown'}%`"
        :icon="getIconForStatus(scoredGames.dailyStreakStats.percentTimeInRangeForNights.currentStreak.currentDayStatus)"
        :icon-color="getColorForStatus(scoredGames.dailyStreakStats.percentTimeInRangeForNights.currentStreak.currentDayStatus)"
        :best="scoredGames.dailyStreakStats.percentTimeInRangeForNights.bestDay && (scoredGames.dailyStreakStats.percentTimeInRangeForNights.currentScoredDayWithFallback?.score ?? 0) >= scoredGames.dailyStreakStats.percentTimeInRangeForNights.bestDay.score"
        description="time in range"
      />
      <StatBadge
        title="Daily Average Streak"
        :value="`${scoredGames.dailyStreakStats.averageInRangeForFullDay.currentStreak.scoredDays.length} days`"
        :icon="getIconForDailyStreak(scoredGames.dailyStreakStats.averageInRangeForFullDay.currentStreak.scoredDays.length)"
        :icon-color="getColorForDailyStreak(scoredGames.dailyStreakStats.averageInRangeForFullDay.currentStreak.scoredDays.length)"
        :best="scoredGames.dailyStreakStats.averageInRangeForFullDay.bestStreak.length === scoredGames.dailyStreakStats.averageInRangeForFullDay.currentStreak.scoredDays.length"
        description="average within range"
      />
      <StatBadge
        title="In Range Streak"
        :value="`${scoredGames.dailyStreakStats.percentTimeInRangeForFullDay.currentStreak.scoredDays.length} days`"
        :icon="getIconForDailyStreak(scoredGames.dailyStreakStats.percentTimeInRangeForFullDay.currentStreak.scoredDays.length)"
        :icon-color="getColorForDailyStreak(scoredGames.dailyStreakStats.percentTimeInRangeForFullDay.currentStreak.scoredDays.length)"
        :best="scoredGames.dailyStreakStats.percentTimeInRangeForFullDay.bestStreak.length === scoredGames.dailyStreakStats.percentTimeInRangeForFullDay.currentStreak.scoredDays.length"
        description="at least 80% in range"
      />
      <StatBadge
        title="Nighttime Streak"
        :value="`${scoredGames.dailyStreakStats.percentTimeInRangeForNights.currentStreak.scoredDays.length} days`"
        :icon="getIconForDailyStreak(scoredGames.dailyStreakStats.percentTimeInRangeForNights.currentStreak.scoredDays.length)"
        :icon-color="getColorForDailyStreak(scoredGames.dailyStreakStats.percentTimeInRangeForNights.currentStreak.scoredDays.length)"
        :best="scoredGames.dailyStreakStats.percentTimeInRangeForNights.bestStreak.length === scoredGames.dailyStreakStats.percentTimeInRangeForNights.currentStreak.scoredDays.length"
        description="at least 80% in range"
      />
      <StatBadge
        title="Morning Streak"
        :value="`${scoredGames.dailyStreakStats.percentTimeInRangeForMornings.currentStreak.scoredDays.length} days`"
        :icon="getIconForDailyStreak(scoredGames.dailyStreakStats.percentTimeInRangeForMornings.currentStreak.scoredDays.length)"
        :icon-color="getColorForDailyStreak(scoredGames.dailyStreakStats.percentTimeInRangeForMornings.currentStreak.scoredDays.length)"
        :best="scoredGames.dailyStreakStats.percentTimeInRangeForMornings.bestStreak.length === scoredGames.dailyStreakStats.percentTimeInRangeForMornings.currentStreak.scoredDays.length"
        description="at least 80% in range"
      />
      <StatBadge
        title="Afternoon Streak"
        :value="`${scoredGames.dailyStreakStats.percentTimeInRangeForAfternoons.currentStreak.scoredDays.length} days`"
        :icon="getIconForDailyStreak(scoredGames.dailyStreakStats.percentTimeInRangeForAfternoons.currentStreak.scoredDays.length)"
        :icon-color="getColorForDailyStreak(scoredGames.dailyStreakStats.percentTimeInRangeForAfternoons.currentStreak.scoredDays.length)"
        :best="scoredGames.dailyStreakStats.percentTimeInRangeForAfternoons.bestStreak.length === scoredGames.dailyStreakStats.percentTimeInRangeForAfternoons.currentStreak.scoredDays.length"
        description="at least 80% in range"
      />
      <StatBadge
        title="Evening Streak"
        :value="`${scoredGames.dailyStreakStats.percentTimeInRangeForEvenings.currentStreak.scoredDays.length} days`"
        :icon="getIconForDailyStreak(scoredGames.dailyStreakStats.percentTimeInRangeForEvenings.currentStreak.scoredDays.length)"
        :icon-color="getColorForDailyStreak(scoredGames.dailyStreakStats.percentTimeInRangeForEvenings.currentStreak.scoredDays.length)"
        :best="scoredGames.dailyStreakStats.percentTimeInRangeForEvenings.bestStreak.length === scoredGames.dailyStreakStats.percentTimeInRangeForEvenings.currentStreak.scoredDays.length"
        description="at least 80% in range"
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
    <LineGraph
      title="Today's Time in Range"
      :duration="`${scoredGames.dailyStreakStats.percentTimeInRangeForFullDay.currentScoredDayWithFallback?.scoreForDisplay || 'Unknown'}%`"
      :data="scoredGames.dailyStreakStats.percentTimeInRangeForFullDay.currentScoredDayWithFallback?.glucoseRecords || []"
      :low="thresholds.low"
      :high="thresholds.high"
      :best="`${scoredGames.dailyStreakStats.percentTimeInRangeForFullDay.bestDay ? scoredGames.dailyStreakStats.percentTimeInRangeForFullDay.bestDay.scoreForDisplay : 'Unknown'}%`"
    />
    <LineGraph
      title="Last Night's Time in Range"
      :duration="`${scoredGames.dailyStreakStats.percentTimeInRangeForNights.currentScoredDayWithFallback ? scoredGames.dailyStreakStats.percentTimeInRangeForNights.currentScoredDayWithFallback.scoreForDisplay : 'Unknown'}%`"
      :data="scoredGames.dailyStreakStats.percentTimeInRangeForNights.currentScoredDayWithFallback ? scoredGames.dailyStreakStats.percentTimeInRangeForNights.currentScoredDayWithFallback.glucoseRecords : []"
      :low="thresholds.low"
      :high="thresholds.high"
      :best="`${scoredGames.dailyStreakStats.percentTimeInRangeForNights.bestDay ? scoredGames.dailyStreakStats.percentTimeInRangeForNights.bestDay.scoreForDisplay : 'Unknown'}%`"
    />
    <LineGraph
      title="This Morning's Time in Range"
      :duration="`${scoredGames.dailyStreakStats.percentTimeInRangeForMornings.currentScoredDayWithFallback ? scoredGames.dailyStreakStats.percentTimeInRangeForMornings.currentScoredDayWithFallback.scoreForDisplay : 'Unknown'}%`"
      :data="scoredGames.dailyStreakStats.percentTimeInRangeForMornings.currentScoredDayWithFallback ? scoredGames.dailyStreakStats.percentTimeInRangeForMornings.currentScoredDayWithFallback.glucoseRecords : []"
      :low="thresholds.low"
      :high="thresholds.high"
      :best="`${scoredGames.dailyStreakStats.percentTimeInRangeForMornings.bestDay ? scoredGames.dailyStreakStats.percentTimeInRangeForMornings.bestDay.scoreForDisplay : 'Unknown'}%`"
    />
    <LineGraph
      title="This Afternoon's Time in Range"
      :duration="`${scoredGames.dailyStreakStats.percentTimeInRangeForAfternoons.currentScoredDayWithFallback ? scoredGames.dailyStreakStats.percentTimeInRangeForAfternoons.currentScoredDayWithFallback.scoreForDisplay : 'Unknown'}%`"
      :data="scoredGames.dailyStreakStats.percentTimeInRangeForAfternoons.currentScoredDayWithFallback ? scoredGames.dailyStreakStats.percentTimeInRangeForAfternoons.currentScoredDayWithFallback.glucoseRecords : []"
      :low="thresholds.low"
      :high="thresholds.high"
      :best="`${scoredGames.dailyStreakStats.percentTimeInRangeForAfternoons.bestDay ? scoredGames.dailyStreakStats.percentTimeInRangeForAfternoons.bestDay.scoreForDisplay : 'Unknown'}%`"
    />
    <LineGraph
      title="This Evening's Time in Range"
      :duration="`${scoredGames.dailyStreakStats.percentTimeInRangeForEvenings.currentScoredDayWithFallback ? scoredGames.dailyStreakStats.percentTimeInRangeForEvenings.currentScoredDayWithFallback.scoreForDisplay : 'Unknown'}%`"
      :data="scoredGames.dailyStreakStats.percentTimeInRangeForEvenings.currentScoredDayWithFallback ? scoredGames.dailyStreakStats.percentTimeInRangeForEvenings.currentScoredDayWithFallback.glucoseRecords : []"
      :low="thresholds.low"
      :high="thresholds.high"
      :best="`${scoredGames.dailyStreakStats.percentTimeInRangeForEvenings.bestDay ? scoredGames.dailyStreakStats.percentTimeInRangeForEvenings.bestDay.scoreForDisplay : 'Unknown'}%`"
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

const { scoredGames } = useGlucoseValues(props.glucoseValues, props.thresholds)
</script>
