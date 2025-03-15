<template>
  <div
    class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full gap-4"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-6">
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
      <DailyStreakBadge
        title="Daily Average Streak"
        description="average within range"
        unit="mg/dl"
        :streak-stats="scoredGames.dailyStreakStats.averageInRangeForFullDay"
      />
      <DailyStreakBadge
        title="In Range Streak"
        description="at least 80% in range"
        unit="%"
        :streak-stats="scoredGames.dailyStreakStats.percentTimeInRangeForFullDay"
      />
      <DailyStreakBadge
        title="Nighttime Streak"
        description="at least 80% in range"
        unit="%"
        :streak-stats="scoredGames.dailyStreakStats.percentTimeInRangeForNights"
      />
      <DailyStreakBadge
        title="Morning Streak"
        description="at least 80% in range"
        unit="%"
        :streak-stats="scoredGames.dailyStreakStats.percentTimeInRangeForMornings"
      />
      <DailyStreakBadge
        title="Afternoon Streak"
        description="at least 80% in range"
        unit="%"
        :streak-stats="scoredGames.dailyStreakStats.percentTimeInRangeForAfternoons"
      />
      <DailyStreakBadge
        title="Evening Streak"
        description="at least 80% in range"
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
import type { GlucoseRecord } from '~/types/glucoseRecord'
import type { Thresholds } from '~/types/thresholds'
import { getIconForStatus, getColorForStatus } from '~/utils/status/status'

const props = defineProps<{
  thresholds: Thresholds
  glucoseValues?: Ref<GlucoseRecord[]> | undefined
}>()

const { scoredGames } = useGlucoseValues(props.glucoseValues, props.thresholds)
</script>
