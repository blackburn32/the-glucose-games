<template>
  <div class="flex flex-col w-full space-y-2">
    <div class="text-2xl w-full font-semibold">
      Thresholds
    </div>
    <div class="flex flex-row w-full space-x-4">
      <div class="text-lg w-16">
        Low:
      </div>
      <div class="w-16">
        {{ tempLow }}
      </div>
      <label class="form-control w-full">
        <input
          v-model="tempLow"
          type="range"
          min="40"
          max="120"
          step="1"
          class="w-full range range-sm range-primary"
          @mouseup="updateLow"
        >
        <div class="label">
          <span class="label-text-alt">40</span>
          <span class="label-text-alt">120</span>
        </div>
      </label>
    </div>

    <div class="flex flex-row w-full space-x-4">
      <div class="text-lg w-16">
        High:
      </div>
      <div class="w-16">
        {{ tempHigh }}
      </div>
      <label class="form-control w-full">
        <input
          v-model="tempHigh"
          type="range"
          min="120"
          max="400"
          step="1"
          class="w-full range range-sm range-primary"
          @mouseup="updateHigh"
        >
        <div class="label">
          <span class="label-text-alt">120</span>
          <span class="label-text-alt">400</span>
        </div>
      </label>
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
