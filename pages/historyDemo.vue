<template>
  <div class="flex flex-col w-full items-center space-y-4">
    <div class="flex flex-row w-full items-end justify-center space-x-4">
      <NuxtLink
        class="btn btn-outline"
        to="/demo"
      >
        Current games
      </NuxtLink>
      <div class="text-4xl text-center font-bold mt-10">
        Gaming Records (Demo)
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
    <NuxtClientFallback @ssr-error="logSsrError">
      <HistoryViewer :glucose-values="computed(() => demoGlucoseData)" />
    </NuxtClientFallback>
  </div>
</template>

<script setup lang="ts">
const demoGlucoseData = useState('demoGlucoseData', () => generateGlucoseValues(RealisticGeneratorConfig, 2000))
const refreshData = () => {
  demoGlucoseData.value = generateGlucoseValues(RealisticGeneratorConfig, 2000)
}
const logSsrError = (error: Error) => {
  console.error('An error occurred during ssr:', error.message, error.stack)
}
</script>
