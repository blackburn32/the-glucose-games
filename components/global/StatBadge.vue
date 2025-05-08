<template>
  <div
    class="stats w-full overflow-hidden"
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
        <div class="stat-desc text-xs text-base-content opacity-70 mt-[2px]">
          {{ description }}
        </div>
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
}>()
</script>
