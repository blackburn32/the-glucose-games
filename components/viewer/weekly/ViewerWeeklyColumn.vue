<template>
  <div class="grid grid-cols-1 gap-2">
    <UTooltip
      v-for="scoredDay in scoredDays"
      :key="scoredDay.date.toString()"
      :text="getDayTooltip(scoredDay)"
      :delay-duration="0"
      :ui="{
        content: 'bg-base-300',
      }"
    >
      <div
        class="flex h-8 w-full rounded-full items-center justify-center"
        :class="{
          'bg-accent': scoredDay.scoreResult === ScoreCheckResult.Pass,
          'bg-warning': scoredDay.scoreResult === ScoreCheckResult.Almost,
          'bg-error': scoredDay.scoreResult === ScoreCheckResult.Fail,
          'bg-base-300': scoredDay.scoreResult === ScoreCheckResult.Missing,
        }"
      >
        <Icon
          v-if="scoredDay.scoreResult === ScoreCheckResult.Missing"
          name="ph:question"
          size="24"
        />
      </div>
    </UTooltip>
    <div
      v-for="i in [...Array(remainingDaysInWeek).keys()]"
      :key="i"
      class="h-8 w-full rounded-full bg-base-100"
    />
    <div
      class="text-xs font-medium text-center"
    >
      {{ timeKey }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DailyStreakStats } from '~/types/dailyStreakStats'
import { ScoreCheckResult } from '~/types/scoreCheckResult'
import { WeeklyTimePeriods } from '~/types/constants'
import type { ScoredDay } from '~/types/scoredDay'

const props = defineProps<{
  timeKey: string
  dailyStreakStats: DailyStreakStats
  unit: string
}>()

const matchingTimePeriod = WeeklyTimePeriods.find(
  timePeriod => timePeriod.name === props.timeKey,
) || WeeklyTimePeriods[0]

const currentDayOfWeek = computed(() => {
  return new Date().getDay()
})

const currentHour = computed(() => {
  return new Date().getHours()
})

const includeCurrentDay = computed(() => {
  return currentHour.value >= matchingTimePeriod.startHour
})

const daysToShow = computed(() => {
  return currentDayOfWeek.value + 1
})

const scoredDays = computed(() => {
  return props.dailyStreakStats.scoredDays.toReversed().slice((includeCurrentDay.value ? 0 : 1), daysToShow.value).toReversed()
})

const remainingDaysInWeek = computed(() => {
  return 7 - (daysToShow.value - (includeCurrentDay.value ? 0 : 1))
})

const getDayTooltip = (day: ScoredDay) => {
  const date = day.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  if (day.date.getDay() === currentDayOfWeek.value && !includeCurrentDay.value) {
    return `${date}: Unknown`
  }
  return `${date}: ${day.scoreForDisplay}${props.unit}`
}
</script>
