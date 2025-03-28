<template>
  <div class="w-full h-full flex flex-row justify-around items-end px-4">
    <div
      v-for="(number, index) in numbers"
      :key="index"
      class="flex flex-col items-center"
      :style="{ height: calculateHeight(number) }"
    >
      <div class="text-secondary-content font-semibold">
        {{ number }}
      </div>
      <div class="h-full mt-1 border-dashed border-l-2 " />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  numbers: {
    type: Array as PropType<number[]>,
    required: true,
  },
  maxHeight: {
    type: Number,
    default: 240,
  },
  maxValue: {
    type: Number,
    default: 360,
  },
})

const calculateHeight = (number: number) => {
  // Scale the number to fit within the maxHeight
  // With at least 40px for the lowest value
  const scaledHeight = (number / props.maxValue) * props.maxHeight + 40
  return `${scaledHeight}px`
}
</script>
