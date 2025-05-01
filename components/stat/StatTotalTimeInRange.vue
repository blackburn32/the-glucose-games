<template>
  <StatBadge
    title="Total time in range"
    :value="prettyMilliseconds(totalStreakDurationMs + timeSinceLastResultMs, { secondsDecimalDigits: 0 })"
    icon-color="text-accent"
    description="during selected duration"
  />
</template>

<script setup lang="ts">
import { useInterval } from '@vueuse/shared'
import prettyMilliseconds from 'pretty-ms'
import type { ContiguousStreakStats } from '~/types/contiguousStreakStats'
import { getStreakDuration } from '~/utils/formatting/getStreakDurationString'

const nuxtApp = useNuxtApp()
const scoredGames = nuxtApp.$scoredGames
const contiguousStreakStats: Ref<ContiguousStreakStats> = computed(() => scoredGames.value.contiguousStreakStats.noHighsOrLowsStreaks)

const streakDurations = computed(() => {
  return contiguousStreakStats.value.streaks.map((streak) => {
    return getStreakDuration(streak)
  })
})

const totalStreakDurationMs = computed(() => {
  return streakDurations.value.reduce((acc, streak) => acc + streak, 0)
})

const calculateTimeSinceLastResult = () => {
  if (!contiguousStreakStats.value.currentlyInStreak) return 0
  const lastResult = contiguousStreakStats.value.currentStreak.at(-1)
  if (!lastResult) return 0
  const now = new Date()
  return now.getTime() - lastResult.created.getTime()
}

const timeSinceLastResultMs = ref(calculateTimeSinceLastResult())
useInterval(1000, {
  callback: () => timeSinceLastResultMs.value = calculateTimeSinceLastResult(),
})
</script>
