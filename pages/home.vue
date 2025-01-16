<template>
  <div class="flex flex-col w-full items-center space-y-4 min-h-[calc(100vh-248px)]">
    <div class="text-4xl font-bold mt-10">
      Home
    </div>
    <div class="flex flex-col space-y-2 w-full md:max-w-lg">
      <div class="text-2xl font-bold">
        Last hour:
      </div>
      <LineGraph
        :data="mostRecentHour"
        :low="0"
        :high="300"
      />
    </div>
    <div class="flex flex-row items-center md:max-w-lg">
      <StatBadge
        title="Current Blood Sugar"
        :value="mostRecentHour[mostRecentHour.length - 1].value.toString()"
        description="mg/dl"
      />
      <StatBadge
        title="Time in Range"
        :value="cleanPercentTimeInRangeOverPrevious24Hours + '%'"
        description="over the last 24 hours"
        :icon="timeInRangeIcon"
        :icon-color="timeInRangeIconColor"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const {
  cleanPercentTimeInRangeOverPrevious24Hours,
  mostRecentHour,
  percentTimeInRangeOverPrevious24Hours,
} = useGlucoseValues()

const timeInRangeIcon = computed(() => {
  if (percentTimeInRangeOverPrevious24Hours.value >= 90) {
    return 'ph:crown'
  }
  else if (percentTimeInRangeOverPrevious24Hours.value >= 70) {
    return 'ph:medal'
  }
  else if (percentTimeInRangeOverPrevious24Hours.value >= 50) {
    return 'ph:trophy'
  }
})

const timeInRangeIconColor = computed(() => {
  if (percentTimeInRangeOverPrevious24Hours.value >= 90) {
    return 'text-accent'
  }
  else if (percentTimeInRangeOverPrevious24Hours.value >= 70) {
    return 'text-primary'
  }
  else if (percentTimeInRangeOverPrevious24Hours.value >= 50) {
    return 'text-secondary'
  }
})
</script>
