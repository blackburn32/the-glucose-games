<template>
  <div class="flex flex-col w-full items-center space-y-4 px-2 mb-10">
    <div class="text-4xl text-center font-bold mt-10">
      Achievements (Demo)
    </div>
    <div class="flex flex-row w-full items-end justify-center space-x-4">
      <NuxtLink
        class="btn btn-soft"
        to="/demo"
      >
        Current Games
      </NuxtLink>
      <NuxtLink
        class="btn btn-soft"
        to="/historyDemo"
      >
        Gaming Records
      </NuxtLink>
      <div
        class="btn btn-soft space-x-2"
        @click="refreshData"
      >
        <Icon
          name="ph:arrow-counter-clockwise"
          :size="24"
          class="cursor-pointer hover:scale-105"
        />
        <div class="text-sm">
          Randomize Data
        </div>
      </div>
    </div>
    <AchievementsViewer />
    <DemoThresholdSlider class="max-w-full md:max-w-xl mx-2" />
    <DemoTargetSliders class="max-w-full md:max-w-xl mx-2" />
  </div>
</template>

<script setup lang="ts">
const nuxtApp = useNuxtApp()
const { thresholds } = useDemoThresholds()

const refreshData = () => {
  nuxtApp.$randomizeDemoData()
}

provide('glucoseValuesInjectable', nuxtApp.$demoData)
provide('scoredGamesInjectable', nuxtApp.$demoScoredGames)
provide('thresholdsInjectable', thresholds)
</script>
