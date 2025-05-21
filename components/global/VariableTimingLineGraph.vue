<template>
  <div class="flex flex-col w-full space-y-2 bg-base-200 rounded-2xl p-[24px]">
    <LineGraph
      :data="currentData.data"
      :title="currentData.title + titleSuffix"
      :duration="stats ? currentData.description : ''"
      :best="stats ? currentData.best : ''"
      :low="low"
      :high="high"
    />
    <div
      v-if="providedTiming === undefined"
      class="flex flex-row w-full space-x-4 items-center"
    >
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
import { FullDayTiming, AllTimings } from '~/types/timing'
import type { TimeBasedDailyStreaks } from '~/types/timeBasedDailyStreaks'
import { getDailyStreakGameDisplayStatsForSemanticPeriod, getPercentToDisplay } from '~/utils/display/gameDisplay'

const props = defineProps<{
  stats: boolean
  semanticPeriods: TimeBasedDailyStreaks
  titleSuffix: string
  low?: number | undefined
  high?: number | undefined
  providedTiming?: number | undefined
}>()

const currentTiming = ref(FullDayTiming.id)
const timing = computed(() => {
  const timingToUseId = props.providedTiming ?? currentTiming.value
  return AllTimings.find(timing => timing.id === timingToUseId) ?? FullDayTiming
})

const { selectedDate } = useSelectedDate()

const currentData = computed(() => {
  return getDailyStreakGameDisplayStatsForSemanticPeriod(timing.value, props.semanticPeriods, getPercentToDisplay, selectedDate.value)
})
</script>
