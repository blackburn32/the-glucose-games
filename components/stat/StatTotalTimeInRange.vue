<template>
  <StatBadge
    title="Total time in range"
    :value="prettyMilliseconds(totalStreakDurationMs + Number(timeSinceLastResultMs), { secondsDecimalDigits: 0 })"
    icon-color="text-accent"
    description="throughout selected duration"
  />
</template>

<script setup lang="ts">
import prettyMilliseconds from 'pretty-ms'
import type { ContiguousStreakStats } from '~/types/contiguousStreakStats'
import { getStreakDuration } from '~/utils/formatting/getStreakDurationString'
import { useTimeSince } from '~/composables/useTimeSince'

const nuxtApp = useNuxtApp()
const scoredGames = nuxtApp.$filteredScoredGames
const contiguousStreakStats: Ref<ContiguousStreakStats> = computed(() => scoredGames.value.contiguousStreakStats.noHighsOrLowsStreaks)

const streakDurations = computed(() => {
  return contiguousStreakStats.value.streaks.map((streak) => {
    return getStreakDuration(streak)
  })
})

const totalStreakDurationMs = computed(() => {
  return streakDurations.value.reduce((acc, streak) => acc + streak, 0)
})

const lastResultDate = computed(() => {
  if (!contiguousStreakStats.value.currentlyInStreak) return undefined
  const lastResult = contiguousStreakStats.value.currentStreak.at(-1)
  return lastResult?.created
})
const timeSinceLastResultMs = useTimeSince(lastResultDate)
</script>
