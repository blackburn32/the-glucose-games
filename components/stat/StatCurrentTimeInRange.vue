<template>
  <StatBadge
    v-if="currentDayStat"
    title="Today's time in range"
    :value="`${currentDayStat.scoreForDisplay}%`"
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
const timeInRangeDailyStreakStats: Ref<DailyStreakStats> = computed(() => scoredGames.value.dailyStreakStats.percentTimeInRangeForFullDay)
const currentDayStat = computed(() => timeInRangeDailyStreakStats.value.currentScoredDayWithFallback)
const timeUntilEndOfDay = useTimeUntilEndOfDay()
</script>
