<template>
  <VariableTimingLineGraph
    :morning="morning"
    :afternoon="afternoon"
    :evening="evening"
    :night="night"
    :full-day="fullDay"
    :low="thresholds.low"
    :high="thresholds.high"
  />
</template>

<script setup lang="ts">
import type { ScoredGlucoseGames } from '~/types/scoredGlucoseGames'
import type { Thresholds } from '~/types/thresholds'
import type { GameDisplayStats } from '~/types/gameDisplayStats'
import { getDailyStreakGameDisplayStats, getPercentToDisplay } from '~/utils/display/gameDisplay'

const props = defineProps<{
  games: ScoredGlucoseGames
  thresholds: Thresholds
}>()

const morning: Ref<GameDisplayStats> = computed(() => {
  return getDailyStreakGameDisplayStats('This Morning\'s Time in Range', props.games.dailyStreakStats.percentTimeInRangeForMornings, getPercentToDisplay)
})

const afternoon: Ref<GameDisplayStats> = computed(() => {
  return getDailyStreakGameDisplayStats('This Afternoon\'s Time in Range', props.games.dailyStreakStats.percentTimeInRangeForAfternoons, getPercentToDisplay)
})

const evening: Ref<GameDisplayStats> = computed(() => {
  return getDailyStreakGameDisplayStats('This Evening\'s Time in Range', props.games.dailyStreakStats.percentTimeInRangeForEvenings, getPercentToDisplay)
})

const night: Ref<GameDisplayStats> = computed(() => {
  return getDailyStreakGameDisplayStats('Last Night\'s Time in Range', props.games.dailyStreakStats.percentTimeInRangeForNights, getPercentToDisplay)
})

const fullDay: Ref<GameDisplayStats> = computed(() => {
  return getDailyStreakGameDisplayStats('Today\'s Time in Range', props.games.dailyStreakStats.percentTimeInRangeForFullDay, getPercentToDisplay)
})
</script>
