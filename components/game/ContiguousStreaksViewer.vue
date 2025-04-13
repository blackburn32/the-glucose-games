<template>
  <div class="flex flex-col w-full space-y-2">
    <LineGraph
      :data="currentGames.currentStreak"
      :title="currentGames.title"
      :duration="currentGames.currentStreakString"
      :best="currentGames.longestStreakString"
      :low="currentGames.low"
      :high="currentGames.high"
    />
    <div class="flex flex-row w-full space-x-4 items-center">
      <div class="flex flex-row space-x-2 items-center ml-8">
        <Icon
          name="ph:arrows-down-up"
          size="24"
          class="shrink-0 cursor-pointer hover:scale-105"
          :class="{
            'text-primary': currentGames.title === scoredGames.contiguousStreakStats.noHighsOrLowsStreaks.title,
          }"
          @click="currentGames = scoredGames.contiguousStreakStats.noHighsOrLowsStreaks"
        />
        <Icon
          name="ph:arrow-up"
          size="24"
          class="shrink-0 cursor-pointer hover:scale-105"
          :class="{
            'text-primary': currentGames.title === scoredGames.contiguousStreakStats.noHighsStreaks.title,
          }"
          @click="currentGames = scoredGames.contiguousStreakStats.noHighsStreaks"
        />
        <Icon
          name="ph:arrow-down"
          size="24"
          class="shrink-0 cursor-pointer hover:scale-105"
          :class="{
            'text-primary': currentGames.title === scoredGames.contiguousStreakStats.noLowsStreaks.title,
          }"
          @click="currentGames = scoredGames.contiguousStreakStats.noLowsStreaks"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ScoredGlucoseGames } from '~/types/scoredGlucoseGames'
import type { ContiguousStreakStats } from '~/types/contiguousStreakStats'

const props = defineProps<{
  scoredGames: ScoredGlucoseGames
}>()

const currentGames = ref<ContiguousStreakStats>(props.scoredGames.contiguousStreakStats.noHighsOrLowsStreaks)
</script>
