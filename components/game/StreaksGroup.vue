<template>
  <div class="flex flex-col space-y-4 p-[24px] pt-[64px]">
    <div class="flex flex-col mb-[40px]">
      <div class="text-2xl font-medium">
        Streaks
      </div>
      <div class="flex flex-row space-x-4 items-center mt-[10px]">
        <div class="flex flex-row space space-x-1 items-center">
          <div class="bg-success rounded-full w-4 h-4" />
          <div class="text-xs text-neutral-content">
            {{ defaultThresholds.dailyStreakPercentTimeInRange }}% in range
          </div>
        </div>
        <div class="flex flex-row space space-x-1 items-center">
          <div class="bg-warning rounded-full w-4 h-4" />
          <div class="text-xs text-neutral-content">
            {{ defaultThresholds.dailyStreakPercentTimeInRange - 10 }}% in range
          </div>
        </div>
        <div class="flex flex-row space space-x-1 items-center">
          <div class="bg-error rounded-full w-4 h-4" />
          <div class="text-xs text-neutral-content">
            Fail
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
      <div class="flex flex-col md:w-2/3 space-y-4">
        <ViewerWeeklyStreaks />
      </div>
      <div class="flex flex-col md:w-1/3 space-y-4 h-full justify-between">
        <StatCurrentStreakLength />
        <GameAverageInRangeDailyStreak />
        <GamePercentTimeInRangeDailyStreak />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const nuxtApp = useNuxtApp()
const defaultThresholds = nuxtApp.$thresholds
</script>
