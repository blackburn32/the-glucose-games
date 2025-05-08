<template>
  <div class="grid grid-cols-7 gap-2 w-full">
    <ClientOnly>
      <UTooltip
        v-for="(day, index) in mostRecentScoredDays"
        :key="`indicator-${index}`"
        :text="getDayTooltip(day)"
        :delay-duration="0"
        :ui="{
          content: 'z-30 b-0 bg-base-300',
        }"
      >
        <div
          class="rounded-full w-full flex items-center justify-center text-xs font-semibold"
          :class="getDayColor(day)"
        >
          {{ getDayLabel(day.date) }}
        </div>
      </UTooltip>
      <template #fallback>
        <div class="text-sm">
          Loading...
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import type { DailyStreakStats } from '~/types/dailyStreakStats'
import { ScoreCheckResult } from '~/types/scoreCheckResult'
import type { ScoredDay } from '~/types/scoredDay'
import { scoredDayIsPending } from '~/utils/display/gameDisplay'

const props = defineProps<{
  streakStats: DailyStreakStats
  title: string
  unit: string
}>()

const daysToDisplay = 7

const mostRecentScoredDays = computed(() => {
  return props.streakStats.scoredDays.slice(-daysToDisplay, props.streakStats.scoredDays.length)
})

const getDayLabel = (date: Date) => {
  try {
    const d = new Date(date)
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    return days[d.getDay()]
  }
  catch {
    return ''
  }
}

const getDayColor = (day: ScoredDay) => {
  if (scoredDayIsPending(day)) {
    return 'bg-base-300'
  }
  if (day.scoreResult === ScoreCheckResult.Pass) {
    return 'bg-success text-success-content'
  }
  if (day.scoreResult === ScoreCheckResult.Fail) {
    return 'bg-error text-error-content'
  }
  if (day.scoreResult === ScoreCheckResult.Almost) {
    return 'bg-warning text-warning-content'
  }
  return 'bg-base-300'
}

const getDayTooltip = (day: ScoredDay) => {
  const date = day.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  return `${date}: ${day.scoreForDisplay}${props.unit}`
}
</script>
