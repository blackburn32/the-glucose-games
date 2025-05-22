<template>
  <StatBadge
    title="Total time in range"
    :value="prettyMilliseconds(totalStreakDurationMs + Number(timeToAdd), { secondsDecimalDigits: 0 })"
    icon-color="text-accent"
    description=""
    :trend-stats="{ ...trendStats, trendString: `${trendStats.trendDifference > 0 ? '+' : ''}${prettyMilliseconds(trendStats.trendDifference + Number(timeToAdd), { secondsDecimalDigits: 0 })}` }"
  />
</template>

<script setup lang="ts">
import prettyMilliseconds from 'pretty-ms'
import type { ContiguousStreakStats } from '~/types/contiguousStreakStats'
import { getStreakDuration } from '~/utils/formatting/getStreakDurationString'
import { useTimeSince } from '~/composables/useTimeSince'
import { ONE_DAY } from '~/types/constants'

const nuxtApp = useNuxtApp()
const scoredGames = nuxtApp.$filteredScoredGames
const contiguousStreakStats: Ref<ContiguousStreakStats> = computed(() => scoredGames.value.contiguousStreakStats.noHighsOrLowsStreaks)

const trendScoredGames = nuxtApp.$scoredGamesForTrends
const trendContiguousStreakStats: Ref<ContiguousStreakStats> = computed(() => trendScoredGames.value.contiguousStreakStats.noHighsOrLowsStreaks)

const streakDurations = computed(() => {
  return contiguousStreakStats.value.streaks.map((streak) => {
    return getStreakDuration(streak)
  })
})

const trendStreakDurations = computed(() => {
  return trendContiguousStreakStats.value.streaks.map((streak) => {
    return getStreakDuration(streak)
  })
})

const totalStreakDurationMs = computed(() => {
  return streakDurations.value.reduce((acc, streak) => acc + streak, 0)
})

const trendTotalStreakDurationMs = computed(() => {
  return trendStreakDurations.value.reduce((acc, streak) => acc + streak, 0)
})

const trendStats = computed(() => {
  const difference = totalStreakDurationMs.value - trendTotalStreakDurationMs.value
  return {
    trendScore: trendTotalStreakDurationMs.value,
    trendScoreString: prettyMilliseconds(trendTotalStreakDurationMs.value, { secondsDecimalDigits: 0 }),
    trendDifference: difference,
    trendString: prettyMilliseconds(difference, { secondsDecimalDigits: 0 }),
  }
})

const lastResultDate = computed(() => {
  if (!contiguousStreakStats.value.currentlyInStreak) return undefined
  const lastResult = contiguousStreakStats.value.currentStreak.at(-1)
  return lastResult?.created
})
const timeSinceLastResultMs = useTimeSince(lastResultDate)
const inRange = computed(() => {
  return contiguousStreakStats.value.currentlyInStreak
})
const timeToAdd = computed(() => {
  if (inRange.value && timeSinceLastResultMs.value && Number(timeSinceLastResultMs.value) < ONE_DAY) {
    return timeSinceLastResultMs.value
  }
  return 0
})
</script>
