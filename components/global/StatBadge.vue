<template>
  <div class="indicator w-full">
    <ClientOnly>
      <Icon
        v-if="icon && !hideDecorations"
        class="indicator-item"
        :name="icon"
        size="24"
        :class="iconColor"
      />
    </ClientOnly>
    <div
      v-if="best && !hideDecorations"
      class="badge badge-success indicator-item indicator-bottom bottom-2"
    >
      Best
    </div>
    <div
      class="stats w-full h-min overflow-hidden"
      :class="backgroundOverride ? backgroundOverride : 'bg-base-200'"
    >
      <div class="stat min-w-fit">
        <div class="stat-title text-sm text-base overflow-hidden text-base-content">
          {{ title }}
        </div>
        <ClientOnly>
          <div
            class="stat-value text-2xl text-base-content"
          >
            {{ value }}
          </div>
          <div class="stat-desc text-xs text-base-content">
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
  backgroundOverride?: string | undefined
  hideDecorations?: boolean | undefined
}>()
</script>
