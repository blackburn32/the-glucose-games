<template>
  <div class="flex flex-col w-full">
    <LineGraph
      :data="game.currentScoredDayWithFallback?.glucoseRecords || []"
      :title="title"
    />
  </div>
</template>

<script setup lang="ts">
import type { AllTimingsAndTiersDailyStreakGame } from '~/types/games'

const selectedTiming = ref('fullDay')
const selectedTier = ref('easy')

const props = defineProps<{
  games: AllTimingsAndTiersDailyStreakGame
  title: string
}>()

const timingGames = computed(() => {
  if (selectedTiming.value === 'morning') {
    return props.games.morning
  }
  else if (selectedTiming.value === 'afternoon') {
    return props.games.afternoon
  }
  else if (selectedTiming.value === 'evening') {
    return props.games.evening
  }
  else if (selectedTiming.value === 'night') {
    return props.games.night
  }
  return props.games.fullDay
})

const game = computed(() => {
  if (selectedTier.value === 'easy') {
    return timingGames.value.easy
  }
  else if (selectedTier.value === 'medium') {
    return timingGames.value.medium
  }
  return timingGames.value.hard
})
</script>
