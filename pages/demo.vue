<template>
  <div class="flex flex-col w-full items-center space-y-4 px-2">
    <div class="flex flex-row w-full items-end justify-center">
      <div class="text-4xl text-center font-bold mt-10">
        Current Games (Demo)
      </div>
      <div class="mt-10 flex flex-row items-end space-x-2 ml-8">
        <Icon
          name="ph:arrow-counter-clockwise"
          :size="24"
          class="cursor-pointer hover:scale-105"
          @click="refreshData"
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
const demoGlucoseData = useState('demoGlucoseData', () => generateGlucoseValues(RealisticGeneratorConfig, 1000))
const refreshData = () => {
  demoGlucoseData.value = generateGlucoseValues(RealisticGeneratorConfig, 1000)
}
const thresholds = ref({
  low: 70,
  high: 180,
})
</script>
