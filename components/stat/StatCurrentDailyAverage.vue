<template>
  <StatBadge
    v-if="currentDayStat"
    :title="`${fullTiming?.badgeTitle ?? 'Today\'s '} average`"
    :value="`${currentDayStat.scoreForDisplay} ${unit}`"
    :description="timeUntilEndOfSemanticPeriod"
    :icon="currentDayStat.passesThreshold ? 'ph:check-circle' : undefined"
    icon-color="text-accent"
  />
</template>

<script setup lang="ts">
import type { DailyStreakStats } from '~/types/dailyStreakStats'
import { AllTimings, FullDayTiming } from '~/types/timing'

const props = defineProps<{
  selectedTiming?: number | undefined
}>()

const nuxtApp = useNuxtApp()
const timingToUse = computed(() => props.selectedTiming ?? FullDayTiming.id)
const fullTiming = computed(() => AllTimings.find(t => t.id === timingToUse.value) ?? FullDayTiming)
const timeUntilEndOfSemanticPeriod = useTimeUntilEndOfSemanticPeriod(fullTiming)
const scoredGames = nuxtApp.$scoredGames
const dailyAverageStreakStats: Ref<DailyStreakStats> = computed(() => scoredGames.value.dailyStreakStats.averageInRangeForSemanticPeriods[timingToUse.value])
const currentDayStat = computed(() => dailyAverageStreakStats.value.currentScoredDayWithFallback)
const { unit } = useDisplaySettings()
</script>
