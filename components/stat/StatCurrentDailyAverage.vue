<template>
  <StatBadge
    v-if="currentDayStat"
    title="Today's average"
    :value="`${currentDayStat.scoreForDisplay} ${unit}`"
    :description="`${timeUntilEndOfDay} left in the day`"
    :icon="currentDayStat.passesThreshold ? 'ph:check-circle' : undefined"
    icon-color="text-accent"
  />
</template>

<script setup lang="ts">
import prettyMilliseconds from 'pretty-ms'
import type { DailyStreakStats } from '~/types/dailyStreakStats'

const nuxtApp = useNuxtApp()
const scoredGames = nuxtApp.$scoredGames
const dailyAverageStreakStats: Ref<DailyStreakStats> = computed(() => scoredGames.value.dailyStreakStats.averageInRangeForFullDay)
const currentDayStat = computed(() => dailyAverageStreakStats.value.currentScoredDayWithFallback)
const { unit } = useDisplaySettings()
const timeUntilEndOfDay = computed(() => {
  const now = new Date()
  const endOfDay = new Date(now)
  endOfDay.setHours(23, 59, 59, 999)
  return prettyMilliseconds(endOfDay.getTime() - now.getTime(), { secondsDecimalDigits: 0, compact: true })
})
</script>
