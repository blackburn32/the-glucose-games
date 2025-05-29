<template>
  <div class="flex flex-col space-y-4 p-[24px] pt-[64px] w-full">
    <div class="flex flex-row justify-between items-center pb-[20px]">
      <div class="text-2xl font-medium">
        Your Trends
      </div>
      <DurationDropdown v-model="durationOfData" />
    </div>
    <div
      v-if="!loading"
      class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 overflow-x-auto"
    >
      <StatTotalTimeInRange />
      <StatTotalPercentTimeInRange />
      <StatTotalAverage />
      <StatTotalOutOfRangeTransitions />
    </div>
    <ViewerHourlyProportions v-if="!loading" />
  </div>
</template>

<script setup lang="ts">
import { useNuxtApp } from '#app'
import DurationDropdown from '~/components/global/DurationDropdown.vue'

const nuxtApp = useNuxtApp()
const durationOfData = nuxtApp.$filteredDurationOfData

const loading = ref(true)

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>
