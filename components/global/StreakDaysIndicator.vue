<template>
  <div class="flex flex-row w-full justify-evenly">
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
          class="flex flex-col items-center"
        >
          <div>{{ getDayLabel(day.date) }}</div>
          <Icon
            :name="getIconForDay(day).name"
            :class="getIconForDay(day).color"
            size="16"
          />
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
import type { ScoredDay } from '~/types/scoredDay'
import { getIconAndColorForCurrentDay, getIconAndColorForScoredDay } from '~/utils/display/gameDisplay'

const props = defineProps<{
  streakStats: DailyStreakStats
  title: string
  unit: string
}>()

const daysToDisplay = 7

const mostRecentScoredDays = computed(() => {
  return props.streakStats.scoredDays.slice(-daysToDisplay, props.streakStats.scoredDays.length)
})

const today = new Date()
const dayIsCurrentDay = (day: ScoredDay) => {
  return day.date.toDateString() === today.toDateString()
}

const getIconForDay = (day: ScoredDay) => {
  if (dayIsCurrentDay(day)) {
    return getIconAndColorForCurrentDay(props.streakStats.currentStreak.currentDayStatus, day)
  }
  return getIconAndColorForScoredDay(day)
}

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
