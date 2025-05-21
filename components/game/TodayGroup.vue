<template>
  <div class="flex flex-col space-y-8 pt-[64px] p-[24px]">
    <div class="flex flex-col md:flex-row md:justify-between md:items-center pb-[16px] space-y-4 md:space-y-0">
      <div class="flex flex-col">
        <div class="text-2xl font-medium">
          {{ selectedDayIsToday ? 'Today' : formattedSelectedDate }}
        </div>
        <div
          v-if="mostRecentResult"
          class="flex flex-row space-x-1 items-start md:items-center mt-[10px]"
        >
          <div class="text-sm  opacity-70">
            Current blood glucose: {{ mostRecentResult.value }} {{ unit }}
          </div>
          <div class="text-sm opacity-70">
            ({{ timeSinceMostRecentResult }})
          </div>
        </div>
      </div>
      <div class="flex flex-row items-center space-x-4">
        <SelectedDayControl />
        <TimeOfDayDropdown v-model="timeOfDay" />
      </div>
    </div>
    <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
      <div class="flex flex-col md:w-1/3 space-y-4 h-full justify-between">
        <StatCurrentTimeInRange
          :selected-timing="timeOfDay"
        />
        <StatCurrentDailyAverage
          :selected-timing="timeOfDay"
        />
        <StatCurrentOutOfRangeTransitions
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
import prettyMilliseconds from 'pretty-ms'
import { ref } from 'vue'
import { FullDayTiming } from '~/types/timing'

const timeOfDay = ref(FullDayTiming.id)
const { mostRecentResult } = useGlucoseValues()
const { unit } = useDisplaySettings()
const { formattedSelectedDate, selectedDayIsToday } = useSelectedDate()

const mostRecentResultDate = computed(() => mostRecentResult.value?.created)
const timeSinceMostRecentResult = useTimeSince(mostRecentResultDate, {
  formatter: ms => ms > 0 ? `${String(prettyMilliseconds(ms, { secondsDecimalDigits: 0 }))} ago` : '',
})
</script>
