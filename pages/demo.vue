<template>
  <div class="flex flex-col w-full items-center space-y-4 px-2">
    <div class="flex flex-row w-full items-end justify-center space-x-4">
      <NuxtLink
        class="btn btn-outline"
        to="/historyDemo"
      >
        Gaming Records
      </NuxtLink>
      <div class="text-4xl text-center font-bold mt-10">
        Current Games (Demo)
      </div>
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
  </div>
</template>

<script setup lang="ts">
const demoGlucoseData = useState('demoGlucoseData', () => generateGlucoseValues(RealisticGeneratorConfig, 1000, 30))
const refreshData = () => {
  demoGlucoseData.value = generateGlucoseValues(RealisticGeneratorConfig, 1000, 30)
}
const thresholds = ref({
  low: 70,
  high: 180,
})
</script>
