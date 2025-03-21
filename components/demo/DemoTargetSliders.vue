<template>
  <div class="flex flex-col w-full space-y-2">
    <div class="text-2xl text-center w-full font-semibold">
      Targets
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <fieldset class="fieldset w-full">
        <legend class="fieldset-legend text-lg">
          Glucose: {{ tempTarget }} mg/dL
        </legend>
        <input
          v-model="tempTarget"
          type="range"
          min="80"
          max="180"
          step="1"
          class="w-full range range-sm"
          @mouseup="updateTarget"
        >
        <div class="fieldset-label justify-between">
          <span class="fieldset-label-alt">80</span>
          <span class="fieldset-label-alt">180</span>
        </div>
      </fieldset>

      <fieldset class="fieldset w-full">
        <legend class="fieldset-legend text-lg">
          Time in Range: {{ tempTimeInRange }}%
        </legend>
        <input
          v-model="tempTimeInRange"
          type="range"
          min="0"
          max="100"
          step="1"
          class="w-full range range-sm"
          @mouseup="updateTimeInRange"
        >
        <div class="fieldset-label justify-between">
          <span class="fieldset-label-alt">0</span>
          <span class="fieldset-label-alt">100</span>
        </div>
      </fieldset>
    </div>
  </div>
</template>

<script setup lang="ts">
const { thresholds } = useDemoThresholds()

const tempTarget = ref(thresholds.value.target)
const updateTarget = () => {
  thresholds.value.target = Math.round(tempTarget.value)
}

const tempTimeInRange = ref(thresholds.value.dailyStreakPercentTimeInRange)
const updateTimeInRange = () => {
  thresholds.value.dailyStreakPercentTimeInRange = Math.round(tempTimeInRange.value)
}
</script>
