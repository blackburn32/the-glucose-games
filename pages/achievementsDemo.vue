<template>
  <div class="flex flex-col w-full items-center space-y-4 px-2">
    <div class="text-4xl text-center font-bold mt-10">
      Achievements (Demo)
    </div>
    <div class="flex flex-row w-full items-end justify-center space-x-4">
      <NuxtLink
        class="btn btn-outline"
        to="/demo"
      >
        Current Games
      </NuxtLink>
      <NuxtLink
        class="btn btn-outline"
        to="/historyDemo"
      >
        Gaming Records
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
    <AchievementsViewer
      :glucose-values="computed(() => demoGlucoseData)"
      :thresholds="thresholds"
    />
  </div>
</template>

<script setup lang="ts">
import { generateGlucoseValues } from '~/utils/generators/glucoseGenerator'
import { RealisticGeneratorConfig } from '~/utils/generators/config/generatorConfig'

const demoGlucoseData = useState('demoGlucoseData', () => generateGlucoseValues(RealisticGeneratorConfig, 2000, 30))
const refreshData = () => {
  demoGlucoseData.value = generateGlucoseValues(RealisticGeneratorConfig, 2000, 30)
}
const { thresholds } = useDemoThresholds()
</script>
