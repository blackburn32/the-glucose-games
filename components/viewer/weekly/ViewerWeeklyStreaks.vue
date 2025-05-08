<template>
  <div class="flex flex-col bg-base-200 rounded-2xl p-8">
    <div class="text-xl md:text-2xl font-medium">
      This Week's time in range
    </div>
    <div
      class="grid grid-cols-13 gap-2 mt-8"
    >
      <ViewerWeeklyDaysColumn />
      <ViewerWeeklyColumn
        v-for="[timeKey, stats] in everyFourHourPeriod"
        :key="timeKey"
        :time-key="timeKey"
        :daily-streak-stats="stats"
        unit="%"
        class="col-span-2"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ViewerWeeklyDaysColumn from '~/components/viewer/weekly/ViewerWeeklyDaysColumn.vue'

const nuxtApp = useNuxtApp()
const scoredGames = nuxtApp.$scoredGames
const everyFourHourPeriod = computed(() => {
  return Object.entries(scoredGames.value.dailyStreakStats.percentTimeInRangeEveryFourHourPeriod)
})
</script>
