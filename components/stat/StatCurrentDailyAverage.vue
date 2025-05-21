<template>
  <StatBadge
    :title="`${fullTiming?.badgeTitle ?? 'Today\'s '} average`"
    :value="valueToDisplay"
    :description="timeUntilEndOfSemanticPeriod"
    :icon="currentDayStat?.passesThreshold ? 'ph:check-circle' : undefined"
    :best="currentDayIsBestDayOrTie"
    icon-color="text-accent"
  />
</template>

<script setup lang="ts">
import { getLocalTimeZone } from '@internationalized/date'
import { differenceInDays } from 'date-fns'
import type { DailyStreakStats } from '~/types/dailyStreakStats'
import { AllTimings, FullDayTiming } from '~/types/timing'

const props = defineProps<{
  selectedTiming?: number | undefined
}>()

const { selectedDate, selectedDayIsToday } = useSelectedDate()

const nuxtApp = useNuxtApp()
const timingToUse = computed(() => props.selectedTiming ?? FullDayTiming.id)
const fullTiming = computed(() => AllTimings.find(t => t.id === timingToUse.value) ?? FullDayTiming)
const thresholds = nuxtApp.$thresholds
const timeUntilEndOfSemanticPeriod = useTimeUntilEndOfSemanticPeriod(fullTiming, selectedDayIsToday)
const scoredGames = nuxtApp.$scoredGames
const dailyAverageStreakStats: Ref<DailyStreakStats> = computed(() => scoredGames.value.dailyStreakStats.averageInRangeForSemanticPeriods[timingToUse.value])
const timezone = getLocalTimeZone()
const currentDayStat = computed(() => dailyAverageStreakStats.value.scoredDays.find((s) => {
  const difference = differenceInDays(s.date, selectedDate.value.toDate(timezone))
  return difference === 0 && s.glucoseRecords.length > 0
}))

const valueToDisplay = computed(() => {
  if (!currentDayStat.value) {
    return 'No data'
  }
  return `${currentDayStat.value.scoreForDisplay} ${unit.value}`
})

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
