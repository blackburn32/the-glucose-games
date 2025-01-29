<template>
  <div class="w-full md:max-w-6xl grid grid-cols-1 md:grid-cols-2">
    <div class="flex flex-col p-2">
      <LineGraph
        v-if="streakToDisplay"
        class="w-full"
        :title="title"
        :data="streakToDisplay.glucoseRecords"
        :low="lowLine"
        :high="highLine"
      />
    </div>
    <div class="flex flex-col p-2">
      <div class="text-2xl font-bold w-full text-start">
        {{ title }}
      </div>
      <div class="text-lg w-full text-start">
        {{ description }}
      </div>
      <div class="grid grid-cols-2 w-fit min-w-48">
        <span class="font-bold">Current:</span> <span>{{ streakStats.currentStreak.scoredDays.length }} days</span>
        <span class="font-bold">Best:</span> <span>{{ streakStats.bestStreak.length }} days</span>
      </div>
      <div class="flex flex-row space-x-4">
        <ClientOnly>
          <VDatePicker
            v-model="selectedDate"
            class="mt-2"
            :min-date="minDate"
            :max-date="maxDate"
            :attributes="attrs"
            :is-dark="true"
            color="oklch(0.848707 0 0)"
            transparent
            borderless
          />
        </ClientOnly>
        <div class="flex flex-col">
          <span class="font-bold">Date:</span>
          <span>{{ cleanSelectedDate }}</span>
          <span class="font-bold mt-4">{{ scoreLabel }}</span>
          <span>{{ scoreForDisplayedStreak }} {{ scoreUnits }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isSameDay } from 'date-fns'
import type { DailyStreakStats } from '~/types/dailyStreakStats'

const selectedDate = ref(new Date())
const cleanSelectedDate = computed(() => {
  return selectedDate.value.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
})

const props = defineProps<{
  title: string
  description: string
  scoreLabel: string
  scoreUnits: string
  streakStats: DailyStreakStats
  highLine?: number | undefined
  lowLine?: number | undefined
}>()

const streakToDisplay = computed(() => {
  return props.streakStats.scoredDays.find((scoredDay) => {
    return isSameDay(scoredDay.date, selectedDate.value)
  })
})
const scoreForDisplayedStreak = computed(() => {
  return streakToDisplay.value?.scoreForDisplay || 'N/A'
})

const minDate = computed(() => {
  return props.streakStats.scoredDays.reduce((min, scoredDay) => {
    return scoredDay.date < min ? scoredDay.date : min
  }, new Date())
})

const maxDate = computed(() => {
  return props.streakStats.scoredDays.reduce((max, scoredDay) => {
    return scoredDay.date > max ? scoredDay.date : max
  }, new Date())
})

const attrs = computed(() => {
  return props.streakStats.streakDates.map((streak) => {
    return {
      key: 'passing',
      highlight: {
        start: { color: 'green' },
        base: { fillMode: 'light', color: 'green' },
        end: { color: 'green' },
      },
      dates: streak,
    }
  })
})
</script>
