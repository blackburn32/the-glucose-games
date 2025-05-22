<template>
  <div
    class="stats w-full overflow-hidden min-w-fit"
    :class="backgroundOverride ? backgroundOverride : 'bg-base-200'"
  >
    <div class="stat min-w-fit p-[24px]">
      <div class="stat-title justify-between flex flex-row">
        <div class="overflow-hidden text-sm text-base-content font-normal opacity-70">
          {{ title }}
        </div>
        <div
          v-if="best"
          class="badge badge-accent text-sm py-0 h-[20px]"
        >
          Best
        </div>
      </div>
      <ClientOnly>
        <div
          class="stat-value text-2xl text-base-content"
        >
          {{ value }}
        </div>
        <div
          v-if="description"
          class="stat-desc text-xs text-base-content opacity-70 mt-[2px]"
        >
          {{ description }}
        </div>
        <UTooltip :text="trendStats?.trendTooltip ?? `Compared to ${trendStats?.trendScoreString} the period before`">
          <div
            v-if="trendStats"
            class="text-base-content mt-[4px] border px-2 py-1 w-fit rounded-md"
            :class="{
              'text-success bg-success/10': trendStats.trendDifference > 0,
              'text-error bg-error/10': trendStats.trendDifference < 0,
            }"
          >
            {{ trendStats.trendString }}
          </div>
        </UTooltip>
        <template #fallback>
          <div class="stat-value text-lg">
            Loading...
          </div>
          <div class="stat-desc">
            Loading...
          </div>
        </template>
      </ClientOnly>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DailyStreakStats } from '~/types/dailyStreakStats'
import type { TrendStats } from '~/types/trendStats'

defineProps<{
  title: string
  value: string
  description: string
  icon?: string | undefined
  iconColor?: string | undefined
  best?: boolean | undefined
  showStreakDays?: boolean
  streakStats?: DailyStreakStats
  targetScore?: number
  isPercentage?: boolean
  backgroundOverride?: string | undefined
  hideDecorations?: boolean | undefined
  trendStats?: TrendStats | undefined
}>()
</script>
