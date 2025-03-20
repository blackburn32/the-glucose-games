<template>
  <div class="flex flex-col w-full space-y-2">
    <div class="text-2xl text-center w-full font-semibold">
      Thresholds
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <fieldset class="fieldset w-full">
        <legend class="fieldset-legend text-lg">
          Low: {{ tempLow }}
        </legend>
        <input
          v-model="tempLow"
          type="range"
          min="40"
          max="120"
          step="1"
          class="w-full range range-sm range-error"
          @mouseup="updateLow"
        >
        <div class="fieldset-label justify-between">
          <span class="fieldset-label-alt">40</span>
          <span class="fieldset-label-alt">120</span>
        </div>
      </fieldset>

      <fieldset class="fieldset w-full">
        <legend class="fieldset-legend text-lg">
          High: {{ tempHigh }}
        </legend>
        <input
          v-model="tempHigh"
          type="range"
          min="120"
          max="400"
          step="1"
          class="w-full range range-sm range-secondary"
          @mouseup="updateHigh"
        >
        <div class="fieldset-label justify-between">
          <span class="fieldset-label-alt">120</span>
          <span class="fieldset-label-alt">400</span>
        </div>
      </fieldset>
    </div>
  </div>
</template>

<script setup lang="ts">
const { thresholds } = useDemoThresholds()

const tempLow = ref(thresholds.value.low)
const updateLow = () => {
  thresholds.value.low = Math.round(tempLow.value)
}

const tempHigh = ref(thresholds.value.high)
const updateHigh = () => {
  thresholds.value.high = Math.round(tempHigh.value)
}
</script>
