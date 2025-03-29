<template>
  <div class="flex items-center justify-center w-full h-full relative">
    <GamePercentTimeInRangeDailyStreak
      class="absolute -top-4 -left-8 scale-60 max-w-[300px]"
      :scored-games-override="worstGames"
      :hide-decorations="true"
      background-override="bg-base-100"
    />
    <GamePercentTimeInRangeDailyStreak
      class="absolute scale-60 z-30 max-w-[300px]"
      :scored-games-override="bestGames"
      :hide-decorations="true"
    />
    <GamePercentTimeInRangeDailyStreak
      class="absolute -bottom-4 -right-8  scale-60 max-w-[300px]"
      :scored-games-override="averageGames"
      :hide-decorations="true"
      background-override="bg-base-100"
    />
  </div>
</template>

<script setup lang="ts">
import { generateRandomWalk } from '~/utils/generators/randomWalkGenerator/randomWalkGenerator'
import { RealisticGeneratorConfig, StableGeneratorConfig, TrendsHighGeneratorConfig } from '~/utils/generators/config/generatorConfig'
import { getScoredGames } from '~/utils/games/scoredGames'

const nuxtApp = useNuxtApp()
const thresholds = nuxtApp.$thresholds

const worstControl = ref(generateRandomWalk(TrendsHighGeneratorConfig))
const averageControl = ref(generateRandomWalk(RealisticGeneratorConfig))
const bestControl = ref(generateRandomWalk(StableGeneratorConfig))

const worstGames = getScoredGames(worstControl.value, thresholds.value)
const averageGames = getScoredGames(averageControl.value, thresholds.value)
const bestGames = getScoredGames(bestControl.value, thresholds.value)

bestGames.dailyStreakStats.percentTimeInRangeForFullDay.bestStreak = bestGames.dailyStreakStats.percentTimeInRangeForFullDay.currentStreak.scoredDays
</script>
