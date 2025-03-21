<template>
  <div
    class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full gap-4"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-6">
      <DailyStreakBadge
        title="Daily Average Streak"
        description="average within range"
        :unit="unit"
        :streak-stats="scoredGames.dailyStreakStats.averageInRangeForFullDay"
      />
      <DailyStreakBadge
        title="In Range Streak"
        :description="`at least ${thresholds.dailyStreakPercentTimeInRange}% in range`"
        unit="%"
        :streak-stats="scoredGames.dailyStreakStats.percentTimeInRangeForFullDay"
      />
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
import type { GlucoseRecord } from '~/types/glucoseRecord'
import type { Thresholds } from '~/types/thresholds'

const props = defineProps<{
  thresholds: Thresholds
  glucoseValues?: Ref<GlucoseRecord[]> | undefined
}>()

const { scoredGames } = useGlucoseValues(props.glucoseValues, props.thresholds)
const { unit } = useDisplaySettings()
</script>
