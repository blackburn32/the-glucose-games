<template>
  <DailyStreakBadge
    title="Time in range streak"
    :description="`at least ${thresholds.dailyStreakPercentTimeInRange}% in range`"
    unit="%"
    :streak-stats="dailyStreakStats"
    :background-override="backgroundOverride"
    :hide-decorations="hideDecorations"
  />
</template>

<script setup lang="ts">
import type { ScoredGlucoseGames } from '~/types/scoredGlucoseGames'
import type { Thresholds } from '~/types/thresholds'

const nuxtApp = useNuxtApp()
const defaultScoredGames = nuxtApp.$scoredGames
const injectedScoredGames = inject<Ref<ScoredGlucoseGames>>('scoredGamesInjectable', defaultScoredGames)
const defaultThresholds = nuxtApp.$thresholds
const thresholds = inject<Ref<Thresholds>>('thresholdsInjectable', defaultThresholds)

const props = defineProps<{
  scoredGamesOverride?: ScoredGlucoseGames | undefined
  backgroundOverride?: string | undefined
  hideDecorations?: boolean | undefined
}>()

const scoredGames = computed(() => props.scoredGamesOverride ?? injectedScoredGames.value)

const dailyStreakStats = computed(
  () => scoredGames.value.dailyStreakStats.percentTimeInRangeForFullDay,
)
</script>
