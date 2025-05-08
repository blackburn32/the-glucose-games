<template>
  <StatBadge
    v-if="currentDayStat"
    :title="`${timing?.badgeTitle ?? 'Today\'s '} time in range`"
    :value="`${currentDayStat.scoreForDisplay}%`"
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
const timing = computed(() => AllTimings.find(t => t.id === timingToUse.value) ?? FullDayTiming)
const scoredGames = nuxtApp.$scoredGames
const timeInRangeDailyStreakStats: Ref<DailyStreakStats> = computed(() => scoredGames.value.dailyStreakStats.percentTimeInRangeForSemanticPeriods[timingToUse.value])
const currentDayStat = computed(() => timeInRangeDailyStreakStats.value.currentScoredDayWithFallback)
const timeUntilEndOfSemanticPeriod = useTimeUntilEndOfSemanticPeriod(timing)
</script>
