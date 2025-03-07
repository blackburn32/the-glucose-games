<template>
  <div class="flex flex-col w-full items-center space-y-4 px-2">
    <div class="text-4xl text-center font-bold mt-10 w-full md:max-w-lg">
      Current Games (Demo)
    </div>
    <div class="flex flex-row w-full items-end justify-center space-x-4">
      <NuxtLink
        class="btn btn-outline"
        to="/historyDemo"
      >
        Gaming Records
      </NuxtLink>
      <NuxtLink
        class="btn btn-outline"
        to="/achievementsDemo"
      >
        Achievements
      </NuxtLink>
      <div
        class="btn btn-outline space-x-2"
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
    <GameViewer
      :thresholds="thresholds"
      :glucose-values="computed(() => demoGlucoseData)"
    />
    <DemoThresholdSlider class="max-w-full md:max-w-md" />
  </div>
</template>

<script setup lang="ts">
import { useDemoThresholds } from '~/composables/useDemoThresholds'
import { generateRandomWalk } from '~/utils/generators/randomWalkGenerator/randomWalkGenerator'
import { RealisticGeneratorConfig } from '~/utils/generators/config/generatorConfig'

const demoGlucoseData = useState('demoGlucoseData', () => generateRandomWalk(RealisticGeneratorConfig, 1000, 30))
const refreshData = () => {
  demoGlucoseData.value = generateRandomWalk(RealisticGeneratorConfig, 1000, 30)
}
const { thresholds } = useDemoThresholds()
</script>
