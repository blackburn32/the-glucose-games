<template>
  <div class="flex flex-col bg-base-200 rounded-2xl p-8">
    <div class="text-2xl font-medium">
      Week's time in range
    </div>
    <div class="flex flex-row space-x-4 items-center mt-[10px]">
      <div class="flex flex-row space space-x-1 items-center">
        <div class="bg-accent rounded-full w-4 h-4" />
        <div class="text-xs font-semibold">
          {{ defaultThresholds.dailyStreakPercentTimeInRange }}% in range
        </div>
      </div>
      <div class="flex flex-row space space-x-1 items-center">
        <div class="bg-warning rounded-full w-4 h-4" />
        <div class="text-xs font-semibold">
          10% margin of passing
        </div>
      </div>
      <div class="flex flex-row space space-x-1 items-center">
        <div class="bg-error rounded-full w-4 h-4" />
        <div class="text-xs font-semibold">
          Fail
        </div>
      </div>
    </div>
    <div class="grid grid-cols-13 gap-2 mt-8">
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
const defaultThresholds = nuxtApp.$thresholds
const scoredGames = nuxtApp.$scoredGames
const everyFourHourPeriod = computed(() => {
  return Object.entries(scoredGames.value.dailyStreakStats.percentTimeInRangeEveryFourHourPeriod)
})
</script>
