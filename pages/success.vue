<template>
  <div class="flex flex-col w-full items-center space-y-4 px-2">
    <div class="text-4xl font-bold mt-10">
      {{ title }}
    </div>
    <div>
      <div class="text-2xl">
        {{ description }}
      </div>
    </div>
    <div class="md:max-w-xl w-full">
      <LineGraph
        v-if="hasGlucoseData"
        title="Last 24 Hours Time in Range"
        :duration="`${previous24Hours.cleanPercentTimeInRange}%`"
        :data="previous24Hours.glucoseValues"
        :low="thresholds.low"
        :high="thresholds.high"
      />
    </div>
    <NuxtLink
      class="btn btn-soft"
      to="/current"
    >
      {{ buttonText }}
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const {
  hasGlucoseData,
  previous24Hours,
} = useGlucoseValues()
const { thresholds } = useThresholds()

const title = computed(() => {
  return hasGlucoseData ? 'Success!' : 'Error'
})

const description = computed(() => {
  return hasGlucoseData ? 'You\'re connected' : 'Something went wrong'
})

const buttonText = computed(() => {
  return hasGlucoseData ? 'Start Gaming' : 'Try Again'
})
</script>
