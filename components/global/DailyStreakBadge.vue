<template>
  <StatBadge
    :title="props.title"
    :value="value"
    :description="props.description"
    :icon="icon"
    :icon-color="iconColor"
    :best="best"
    :background-override="backgroundOverride"
    :hide-decorations="hideDecorations"
  >
    <StreakDaysIndicator
      v-if="props.streakStats"
      class="mt-[12px]"
      :streak-stats="props.streakStats"
      :title="props.title"
      :unit="props.unit"
    />
  </StatBadge>
</template>

<script setup lang="ts">
import type { DailyStreakStats } from '~/types/dailyStreakStats'
import { getColorForDailyStreak, getIconForDailyStreak } from '~/utils/status/status'

const props = defineProps<{
  title: string
  description: string
  unit: string
  streakStats?: DailyStreakStats
  backgroundOverride?: string | undefined
  hideDecorations?: boolean | undefined
}>()

const currentStreakLength = computed(() => {
  return props.streakStats?.currentStreak.scoredDays.length ?? 0
})

const value = computed(() => {
  return `${currentStreakLength.value} days`
})

const bestStreakLength = computed(() => {
  return props.streakStats?.bestStreak.length ?? 0
})

const best = computed(() => {
  return currentStreakLength.value === bestStreakLength.value
})

const icon = computed(() => {
  return getIconForDailyStreak(currentStreakLength.value)
})
const iconColor = computed(() => {
  return getColorForDailyStreak(currentStreakLength.value)
})
</script>
