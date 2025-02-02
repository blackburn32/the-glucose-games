<template>
  <div class="flex flex-col w-full items-center space-y-4 min-h-[calc(100vh-248px)]">
    <div class="text-4xl font-bold mt-10">
      Home
    </div>
    <div
      v-if="hasDexcom"
      class="flex flex-col space-y-2 w-full md:max-w-lg"
    >
      <LineGraph
        title="Last Day"
        :data="previous24Hours.glucoseValues"
        :high="thresholds.high"
        :low="thresholds.low"
      />
    </div>
    <DexcomConnector v-else />
    <div
      v-if="hasDexcom"
      class="flex flex-row items-center md:max-w-lg"
    >
      <StatBadge
        v-if="mostRecentRecordWithinLastHour"
        title="Current Blood Sugar"
        :value="mostRecentRecordWithinLastHour.value.toString()"
        description="mg/dl"
      />
      <StatBadge
        title="Time in Range"
        :value="`${previous24Hours.cleanPercentTimeInRange}%`"
        description="over the last 24 hours"
        :icon="timeInRangeIcon"
        :icon-color="timeInRangeIconColor"
      />
    </div>
    <div class="flex flex-row items-center md:max-w-lg space-x-8">
      <NuxtLink
        v-if="hasDexcom"
        class="btn btn-outline"
        to="/current"
      >
        Current Games
      </NuxtLink>
      <NuxtLink
        v-if="hasDexcom"
        class="btn btn-outline"
        to="/history"
      >
        History
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const thresholds = useThresholds()

const {
  mostRecentRecordWithinLastHour,
  previous24Hours,
} = useGlucoseValues()

const {
  hasDexcom,
} = useTokenStatus()

const timeInRangeIcon = computed(() => {
  if (!previous24Hours.value.percentTimeInRange) {
    return ''
  }
  if (previous24Hours.value.percentTimeInRange >= 90) {
    return 'ph:crown'
  }
  else if (previous24Hours.value.percentTimeInRange >= 70) {
    return 'ph:medal'
  }
  else if (previous24Hours.value.percentTimeInRange >= 50) {
    return 'ph:trophy'
  }
  return ''
})

const timeInRangeIconColor = computed(() => {
  if (!previous24Hours.value.percentTimeInRange) {
    return ''
  }
  if (previous24Hours.value.percentTimeInRange >= 90) {
    return 'text-success'
  }
  else if (previous24Hours.value.percentTimeInRange >= 70) {
    return 'text-primary'
  }
  else if (previous24Hours.value.percentTimeInRange >= 50) {
    return 'text-secondary'
  }
  return ''
})
</script>
