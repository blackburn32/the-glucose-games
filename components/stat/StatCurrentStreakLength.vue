<template>
  <StatBadge
    title="Current streak"
    :value="value"
    :description="description"
    :best="currentStreakIsBestStreakOrTie"
  />
</template>

<script setup lang="ts">
import prettyMilliseconds from 'pretty-ms'
import { getStreakDuration } from '~/utils/formatting/getStreakDurationString'
import { useTimeSince } from '~/composables/useTimeSince'

const nuxtApp = useNuxtApp()
const scoredGames = nuxtApp.$scoredGames
const streakStats = computed(() => scoredGames.value.contiguousStreakStats.noHighsOrLowsStreaks)
const lastResultDate = computed(() => {
  if (!streakStats.value.currentlyInStreak) return undefined
  const lastResult = streakStats.value.currentStreak.at(-1)
  return lastResult?.created
})
const timeSinceLastResult = useTimeSince(lastResultDate)
const value = computed(() => {
  if (streakStats.value.currentlyInStreak) {
    const streakDuration = getStreakDuration(streakStats.value.currentStreak)
    return prettyMilliseconds(streakDuration + Number(timeSinceLastResult.value), { secondsDecimalDigits: 0 })
  }
  return 'Not in range'
})
const description = computed(() => {
  if (streakStats.value.currentlyInStreak) {
    return 'in range'
  }
  return ''
})
const currentStreakIsBestStreakOrTie = computed(() => {
  const bestStreak = streakStats.value.longestStreak
  if (!bestStreak || !streakStats.value.currentlyInStreak) {
    return false
  }
  return streakStats.value.currentStreak.length >= bestStreak.length
})
</script>
