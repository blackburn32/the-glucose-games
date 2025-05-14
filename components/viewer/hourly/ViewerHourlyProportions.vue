<template>
  <div class="flex flex-col bg-base-200 rounded-2xl p-8">
    <div class="flex flex-col">
      <div class="text-xl md:text-2xl font-medium">
        Time in Range
      </div>
      <ViewerProportionsKey />
    </div>
    <div class="grid grid-cols-6 gap-[24px] mt-8">
      <div
        v-for="[timeKey] in everyFourHourPeriod"
        :key="timeKey"
        class="flex flex-col h-full"
      >
        <div class="h-[200px] w-full flex flex-col-reverse">
          <UTooltip
            :text="`${timeKey}: ${percentageHeights[timeKey]?.pass || 0}% in range`"
            :delay-duration="0"
            :ui="{
              content: 'bg-base-300',
            }"
          >
            <div
              class="w-full bg-success rounded-xl mb-1"
              :style="{ height: `${percentageHeights[timeKey]?.pass || 0}%` }"
            />
          </UTooltip>

          <UTooltip
            :text="`${timeKey}: ${percentageHeights[timeKey]?.almost || 0}% almost in range`"
            :delay-duration="0"
            :ui="{
              content: 'bg-base-300',
            }"
          >
            <div
              class="w-full bg-warning rounded-xl mb-1"
              :style="{ height: `${percentageHeights[timeKey]?.almost || 0}%` }"
            />
          </UTooltip>

          <UTooltip
            :text="`${timeKey}: ${percentageHeights[timeKey]?.fail || 0}% out of range`"
            :delay-duration="0"
            :ui="{
              content: 'bg-base-300',
            }"
          >
            <div
              class="w-full bg-error rounded-xl mb-1"
              :style="{ height: `${percentageHeights[timeKey]?.fail || 0}%` }"
            />
          </UTooltip>
        </div>
        <div class="text-xs font-medium text-center mt-2">
          {{ timeKey }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ScoreCheckResult } from '~/types/scoreCheckResult'
import ViewerProportionsKey from '~/components/viewer/hourly/ViewerProportionsKey.vue'

const nuxtApp = useNuxtApp()
const scoredGames = nuxtApp.$scoredGames
const everyFourHourPeriod = computed(() => {
  return Object.entries(scoredGames.value.dailyStreakStats.percentTimeInRangeEveryFourHourPeriod)
})

interface HeightPercentages {
  [key: string]: {
    pass: number
    almost: number
    fail: number
  }
}

const percentageHeights = computed((): HeightPercentages => {
  const result: HeightPercentages = {}

  everyFourHourPeriod.value.forEach(([timeKey, stats]) => {
    const totalDays = stats.scoredDays.length
    if (totalDays === 0) {
      result[timeKey] = { pass: 0, almost: 0, fail: 0 }
      return
    }

    const passCount = stats.scoredDays.filter(day => day.scoreResult === ScoreCheckResult.Pass).length
    const almostCount = stats.scoredDays.filter(day => day.scoreResult === ScoreCheckResult.Almost).length
    const failCount = stats.scoredDays.filter(day => day.scoreResult === ScoreCheckResult.Fail).length

    result[timeKey] = {
      pass: Math.round((passCount / totalDays) * 100),
      almost: Math.round((almostCount / totalDays) * 100),
      fail: Math.round((failCount / totalDays) * 100),
    }
  })

  return result
})
</script>
