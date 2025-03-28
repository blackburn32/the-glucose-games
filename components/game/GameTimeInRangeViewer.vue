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
import type { GameDisplayStats } from '~/types/gameDisplayStats'
import { getDailyStreakGameDisplayStats, getPercentToDisplay } from '~/utils/display/gameDisplay'
import type { ScoredGlucoseGames } from '~/types/scoredGlucoseGames'
import type { Thresholds } from '~/types/thresholds'

const nuxtApp = useNuxtApp()
const defaultScoredGames = nuxtApp.$scoredGames
const scoredGames = inject<Ref<ScoredGlucoseGames>>('scoredGamesInjectable', defaultScoredGames)
const defaultThresholds = nuxtApp.$thresholds
const thresholds = inject<Ref<Thresholds>>('thresholdsInjectable', defaultThresholds)

const morning: Ref<GameDisplayStats> = computed(() => {
  return getDailyStreakGameDisplayStats('This Morning\'s Time in Range', scoredGames.value.dailyStreakStats.percentTimeInRangeForMornings, getPercentToDisplay)
})

const afternoon: Ref<GameDisplayStats> = computed(() => {
  return getDailyStreakGameDisplayStats('This Afternoon\'s Time in Range', scoredGames.value.dailyStreakStats.percentTimeInRangeForAfternoons, getPercentToDisplay)
})

const evening: Ref<GameDisplayStats> = computed(() => {
  return getDailyStreakGameDisplayStats('This Evening\'s Time in Range', scoredGames.value.dailyStreakStats.percentTimeInRangeForEvenings, getPercentToDisplay)
})

const night: Ref<GameDisplayStats> = computed(() => {
  return getDailyStreakGameDisplayStats('Last Night\'s Time in Range', scoredGames.value.dailyStreakStats.percentTimeInRangeForNights, getPercentToDisplay)
})

const fullDay: Ref<GameDisplayStats> = computed(() => {
  return getDailyStreakGameDisplayStats('Today\'s Time in Range', scoredGames.value.dailyStreakStats.percentTimeInRangeForFullDay, getPercentToDisplay)
})
</script>
