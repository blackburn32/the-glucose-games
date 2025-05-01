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
import type { DailyStreakStats } from '~/types/dailyStreakStats'
import { useTimeUntilEndOfDay } from '~/composables/useTimeUntilEndOfDay'

const nuxtApp = useNuxtApp()
const scoredGames = nuxtApp.$scoredGames
const dailyAverageStreakStats: Ref<DailyStreakStats> = computed(() => scoredGames.value.dailyStreakStats.averageInRangeForFullDay)
const currentDayStat = computed(() => dailyAverageStreakStats.value.currentScoredDayWithFallback)
const { unit } = useDisplaySettings()
const timeUntilEndOfDay = useTimeUntilEndOfDay()
</script>
