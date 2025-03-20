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
import { getDailyStreakGameDisplayStats, getGlucoseValueToDisplay } from '~/utils/display/gameDisplay'

const { unit } = useDisplaySettings()

const props = defineProps<{
  games: ScoredGlucoseGames
  thresholds: Thresholds
}>()

const morning: Ref<GameDisplayStats> = computed(() => {
  return getDailyStreakGameDisplayStats('This Morning\'s Average', props.games.dailyStreakStats.averageInRangeForMornings, value => getGlucoseValueToDisplay(value, unit.value))
})

const afternoon: Ref<GameDisplayStats> = computed(() => {
  return getDailyStreakGameDisplayStats('This Afternoon\'s Average', props.games.dailyStreakStats.averageInRangeForAfternoons, value => getGlucoseValueToDisplay(value, unit.value))
})

const evening: Ref<GameDisplayStats> = computed(() => {
  return getDailyStreakGameDisplayStats('This Evening\'s Average', props.games.dailyStreakStats.averageInRangeForEvenings, value => getGlucoseValueToDisplay(value, unit.value))
})

const night: Ref<GameDisplayStats> = computed(() => {
  return getDailyStreakGameDisplayStats('Last Night\'s Average', props.games.dailyStreakStats.averageInRangeForNights, value => getGlucoseValueToDisplay(value, unit.value))
})

const fullDay: Ref<GameDisplayStats> = computed(() => {
  return getDailyStreakGameDisplayStats('Today\'s Average', props.games.dailyStreakStats.averageInRangeForFullDay, value => getGlucoseValueToDisplay(value, unit.value))
})
</script>
