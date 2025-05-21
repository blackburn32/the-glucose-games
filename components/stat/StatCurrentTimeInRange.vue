<template>
  <StatBadge
    :title="`${timing?.badgeTitle ?? 'Today\'s '} time in range`"
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
const timing = computed(() => AllTimings.find(t => t.id === timingToUse.value) ?? FullDayTiming)
const scoredGames = nuxtApp.$scoredGames
const timeInRangeDailyStreakStats: Ref<DailyStreakStats> = computed(() => scoredGames.value.dailyStreakStats.percentTimeInRangeForSemanticPeriods[timingToUse.value])
const timezone = getLocalTimeZone()
const currentDayStat = computed(() => timeInRangeDailyStreakStats.value.scoredDays.find((s) => {
  const difference = differenceInDays(s.date, selectedDate.value.toDate(timezone))
  return difference === 0 && s.glucoseRecords.length > 0
}))

const valueToDisplay = computed(() => {
  if (!currentDayStat.value) {
    return 'No data'
  }
  return `${currentDayStat.value.scoreForDisplay}%`
})

const currentDayIsBestDayOrTie = computed(() => {
  const bestDay = timeInRangeDailyStreakStats.value.bestDay
  if (!bestDay || !currentDayStat.value) {
    return false
  }
  return currentDayStat.value.score >= bestDay.score
})
const timeUntilEndOfSemanticPeriod = useTimeUntilEndOfSemanticPeriod(timing, selectedDayIsToday)
</script>
