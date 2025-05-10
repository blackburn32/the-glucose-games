<template>
  <StatBadge
    v-if="currentDayStat"
    :title="`Distinct highs and lows`"
    :value="`${currentDayStat.scoreForDisplay}`"
    :description="timeUntilEndOfSemanticPeriod"
    :icon="currentDayStat.passesThreshold ? 'ph:check-circle' : undefined"
    :best="currentDayIsBestDayOrTie"
    icon-color="text-accent"
  />
</template>

<script setup lang="ts">
import type { DailyStreakStats } from '~/types/dailyStreakStats'
import { AllTimings, FullDayTiming } from '~/types/timing'

const props = defineProps<{
  selectedTiming?: number | undefined
}>()

const nuxtApp = useNuxtApp()
const timingToUse = computed(() => props.selectedTiming ?? FullDayTiming.id)
const timing = computed(() => AllTimings.find(t => t.id === timingToUse.value) ?? FullDayTiming)
const currentDayIsBestDayOrTie = computed(() => {
  const bestDay = outOfRangeTransitionsDailyStreakStats.value.bestDay
  if (!bestDay || !currentDayStat.value) {
    return false
  }
  return currentDayStat.value.score <= bestDay.score
})
const scoredGames = nuxtApp.$scoredGames
const outOfRangeTransitionsDailyStreakStats: Ref<DailyStreakStats> = computed(() => scoredGames.value.dailyStreakStats.outOfRangeTransitionsForSemanticPeriods[timingToUse.value])
const currentDayStat = computed(() => outOfRangeTransitionsDailyStreakStats.value.currentScoredDayWithFallback)
const timeUntilEndOfSemanticPeriod = useTimeUntilEndOfSemanticPeriod(timing)
</script>
