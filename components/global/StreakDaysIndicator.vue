<template>
  <div class="flex flex-row w-full justify-evenly">
    <UTooltip
      v-for="(day, index) in mostRecentScoredDays"
      :key="`indicator-${index}`"
      :text="getDayTooltip(day)"
    >
      <div
        class="flex flex-col items-center"
      >
        <div>{{ getDayLabel(day.date) }}</div>
        <Icon
          :name="getIconAndColorForScoredDay(day).name"
          :class="getIconAndColorForScoredDay(day).color"
          size="16"
        />
      </div>
    </UTooltip>
  </div>
</template>

<script setup lang="ts">
import type { DailyStreakStats } from '~/types/dailyStreakStats'
import type { ScoredDay } from '~/types/scoredDay'
import { getIconAndColorForScoredDay } from '~/utils/display/gameDisplay'

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

const getDayTooltip = (day: ScoredDay) => {
  const date = day.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  return `${date}: ${day.scoreForDisplay}${props.unit}`
}
</script>
