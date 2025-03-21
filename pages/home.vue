<template>
  <div class="flex flex-col w-full items-center space-y-4">
    <div class="text-4xl font-bold mt-10">
      Home
    </div>
    <div
      v-if="hasGlucoseData"
      class="flex flex-col space-y-2 w-full md:max-w-lg"
    >
      <LineGraph
        title="Last Day"
        :data="previous24Hours.glucoseValues"
        :high="thresholds.high"
        :low="thresholds.low"
      />
    </div>
    <div
      v-if="hasGlucoseData"
      class="flex flex-row items-center md:max-w-lg md:space-x-4"
    >
      <StatBadge
        v-if="mostRecentRecordWithinLastHour"
        title="Current Blood Glucose"
        :value="mostRecentRecordWithinLastHour.value?.toFixed(2)"
        :description="unit"
      />
      <StatBadge
        title="Time in Range"
        :value="`${previous24Hours.cleanPercentTimeInRange}%`"
        description="over the last 24 hours"
        :icon="timeInRangeIcon"
        :icon-color="timeInRangeIconColor"
      />
    </div>
    <div class="flex flex-row items-center md:max-w-lg space-x-4">
      <NuxtLink
        v-if="hasGlucoseData"
        class="btn btn-soft"
        to="/current"
      >
        Current Games
      </NuxtLink>
      <NuxtLink
        v-if="hasGlucoseData"
        class="btn btn-soft"
        to="/history"
      >
        History
      </NuxtLink>
      <NuxtLink
        class="btn btn-soft"
        to="/achievements"
      >
        Achievements
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const { thresholds } = useThresholds()
const { unit } = useDisplaySettings()

const {
  hasGlucoseData,
  mostRecentRecordWithinLastHour,
  previous24Hours,
} = useGlucoseValues()

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
    return 'text-primary'
  }
  else if (previous24Hours.value.percentTimeInRange >= 70) {
    return 'text-secondary'
  }
  else if (previous24Hours.value.percentTimeInRange >= 50) {
    return 'text-accent'
  }
  return ''
})
</script>
