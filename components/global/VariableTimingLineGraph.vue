<template>
  <div class="flex flex-col w-full space-y-2 bg-base-200 rounded-2xl p-4">
    <LineGraph
      :data="currentData.data"
      :title="currentData.title"
      :duration="currentData.description"
      :best="currentData.best"
      :low="low"
      :high="high"
    />
    <div class="flex flex-row w-full space-x-4 items-center">
      <div class="flex flex-row space-x-2 items-center ml-8">
        <Icon
          v-for="t in AllTimings"
          :key="t.id"
          :name="t.icon"
          size="24"
          class="shrink-0 cursor-pointer hover:scale-105"
          :class="{
            'text-primary': currentTiming === t.id,
          }"
          @click="currentTiming = t.id"
        />
      </div>
      <div>
        {{ timing?.title }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FullDayTiming, AllTimings, EveningTiming, NightTiming, MorningTiming, AfternoonTiming } from '~/types/timing'
import type { GameDisplayStats } from '~/types/gameDisplayStats'

const props = defineProps<{
  fullDay: GameDisplayStats
  night: GameDisplayStats
  morning: GameDisplayStats
  afternoon: GameDisplayStats
  evening: GameDisplayStats
  low?: number | undefined
  high?: number | undefined
}>()

const currentTiming = ref(FullDayTiming.id)
const timing = computed(() => AllTimings.find(timing => timing.id === currentTiming.value))

const currentData = computed(() => {
  if (currentTiming.value === NightTiming.id) {
    return props.night
  }
  else if (currentTiming.value === MorningTiming.id) {
    return props.morning
  }
  else if (currentTiming.value === AfternoonTiming.id) {
    return props.afternoon
  }
  else if (currentTiming.value === EveningTiming.id) {
    return props.evening
  }
  return props.fullDay
})
</script>
