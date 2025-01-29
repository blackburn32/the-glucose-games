<template>
  <div class="w-full md:max-w-6xl grid grid-cols-1 md:grid-cols-2">
    <div class="flex flex-col p-2">
      <LineGraph
        v-if="streakToDisplay"
        class="w-full"
        :title="title"
        :data="streakToDisplay"
        :low="lowLine"
        :high="highLine"
      />
    </div>
    <div class="flex flex-col p-2">
      <div class="text-2xl font-bold w-full text-start">
        {{ title }}
      </div>
      <div class="text-lg w-full text-start">
        {{ description }}
      </div>
      <div class="grid grid-cols-2 w-fit">
        <span class="font-bold mr-2">Current:</span> <span>{{ streakStats.streakStringToDisplay }}</span>
        <span class="font-bold mr-2">Best:</span> <span>{{ streakStats.longestStreakString }} </span>
      </div>
      <div class="flex flex-col w-full mt-4">
        <div class="text-xl font-bold">
          Best streaks
        </div>
        <UPagination
          v-model="streakIndexToDisplay"
          class="mt-2"
          :page-count="1"
          :total="streaksSortedByLength.length"
        />
        <div class="w-full mt-2 flex flex-row space-x-4">
          <span class="font-bold"> Length: </span> <span>{{ durationToDisplay }}</span>
        </div>
        <div class="w-full flex flex-row space-x-4">
          <span class="font-bold"> Start: </span> <span>{{ startDateToDisplay }}</span>
        </div>
        <div class="w-full flex flex-row space-x-4">
          <span class="font-bold"> End: </span> <span>{{ endDateToDisplay }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ContiguousStreakStats } from '~/types/contiguousStreakStats'
import { getStreakDurationString } from '~/utils/formatting/getStreakDurationString'

const props = defineProps<{
  title: string
  description: string
  streakStats: ContiguousStreakStats
  highLine?: number | undefined
  lowLine?: number | undefined
}>()

const streakIndexToDisplay = ref(1)
const streaksSortedByLength = computed(() => {
  return props.streakStats.streaks.slice().filter(a => a.length > 3).sort((a, b) => b.length - a.length)
})
const streakToDisplay = computed(() => {
  return streaksSortedByLength.value.at(streakIndexToDisplay.value - 1)
})
const durationToDisplay = computed(() => {
  return streakToDisplay.value ? getStreakDurationString(streakToDisplay.value) : 'No streaks'
})
const startDateToDisplay = computed(() => {
  return streakToDisplay.value
    ? streakToDisplay.value.at(0)?.created.toLocaleDateString(
      undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' },
    ) || ''
    : ''
})
const endDateToDisplay = computed(() => {
  return streakToDisplay.value
    ? streakToDisplay.value.at(-1)?.created.toLocaleDateString(
      undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' },
    ) || ''
    : ''
})
</script>
