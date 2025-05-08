<template>
  <div class="flex flex-col space-y-8 pt-[64px] p-[24px]">
    <div class="flex flex-row justify-between items-center pb-[20px]">
      <div class="text-2xl font-medium">
        Today
      </div>
      <TimeOfDayDropdown v-model="timeOfDay" />
    </div>
    <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
      <div class="flex flex-col md:w-1/3 space-y-4 h-full justify-between">
        <StatCurrentBloodGlucose />
        <StatCurrentTimeInRange
          :selected-timing="timeOfDay"
        />
        <StatCurrentDailyAverage
          :selected-timing="timeOfDay"
        />
      </div>
      <div class="flex flex-col md:w-2/3">
        <GameTimeInRangeViewer
          class="max-h-full h-full items-center justify-center"
          :stats="false"
          :provided-timing="timeOfDay"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TimeOfDayDropdown from '~/components/global/TimeOfDayDropdown.vue'
import { FullDayTiming } from '~/types/timing'

const timeOfDay = ref(FullDayTiming.id)
</script>
