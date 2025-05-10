<template>
  <StatBadge
    v-if="currentDayStat"
    :title="`${fullTiming?.badgeTitle ?? 'Today\'s '} average`"
    :value="`${currentDayStat.scoreForDisplay} ${unit}`"
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
const fullTiming = computed(() => AllTimings.find(t => t.id === timingToUse.value) ?? FullDayTiming)
const thresholds = nuxtApp.$thresholds
const timeUntilEndOfSemanticPeriod = useTimeUntilEndOfSemanticPeriod(fullTiming)
const scoredGames = nuxtApp.$scoredGames
const dailyAverageStreakStats: Ref<DailyStreakStats> = computed(() => scoredGames.value.dailyStreakStats.averageInRangeForSemanticPeriods[timingToUse.value])
const currentDayStat = computed(() => dailyAverageStreakStats.value.currentScoredDayWithFallback)
const currentDayIsBestDayOrTie = computed(() => {
  const bestDay = dailyAverageStreakStats.value.bestDay
  if (!bestDay || !currentDayStat.value) {
    return false
  }
  const target = thresholds.value.target
  const bestDiff = Math.abs(bestDay.score - target)
  const currentDiff = Math.abs(currentDayStat.value.score - target)
  return currentDiff <= bestDiff
})
const { unit } = useDisplaySettings()
</script>
