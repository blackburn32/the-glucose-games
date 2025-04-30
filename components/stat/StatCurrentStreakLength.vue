<template>
  <StatBadge
    title="Current streak"
    :value="value"
    :description="description"
  />
</template>

<script setup lang="ts">
import prettyMilliseconds from 'pretty-ms'
import { useInterval } from '@vueuse/shared'
import { getStreakDuration } from '~/utils/formatting/getStreakDurationString'

const nuxtApp = useNuxtApp()
const scoredGames = nuxtApp.$scoredGames
const streakStats = computed(() => scoredGames.value.contiguousStreakStats.noHighsOrLowsStreaks)
const calculateTimeSinceLastResult = () => {
  if (!streakStats.value.currentlyInStreak) return 0

  const lastResult = streakStats.value.currentStreak.at(-1)
  if (!lastResult) return 0

  const now = new Date()
  return now.getTime() - lastResult.created.getTime()
}
const timeSinceLastResult = ref(calculateTimeSinceLastResult())
useInterval(1000, {
  callback: () => timeSinceLastResult.value = calculateTimeSinceLastResult(),
})
const value = computed(() => {
  if (streakStats.value.currentlyInStreak) {
    const streakDuration = getStreakDuration(streakStats.value.currentStreak)
    return prettyMilliseconds(streakDuration + timeSinceLastResult.value, { secondsDecimalDigits: 0 })
  }
  return 'Not in range'
})
const description = computed(() => {
  if (streakStats.value.currentlyInStreak) {
    return 'in range'
  }
  return ''
})
</script>
