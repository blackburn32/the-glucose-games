<template>
  <div class="indicator w-full">
    <ClientOnly>
      <Icon
        v-if="icon"
        class="indicator-item"
        :name="icon"
        size="24"
        :class="iconColor"
      />
    </ClientOnly>
    <div
      v-if="best"
      class="badge badge-success indicator-item indicator-bottom bottom-2"
    >
      Best
    </div>
    <div class="stats w-full h-min overflow-hidden bg-base-300">
      <div class="stat min-w-fit">
        <div class="stat-title text-base">
          {{ title }}
        </div>
        <ClientOnly>
          <div
            class="stat-value"
          >
            {{ value }}
          </div>
          <div class="stat-desc">
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
}>()
</script>
