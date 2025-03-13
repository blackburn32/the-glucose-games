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
      class="badge badge-primary indicator-item indicator-bottom bottom-2"
    >
      Best
    </div>
    <div class="stats w-full h-min overflow-hidden bg-base-300">
      <div class="stat min-w-fit">
        <div class="stat-title mb-1">
          {{ title }}
        </div>
        <ClientOnly>
          <!-- Show streak days indicator above the value -->
          <div
            v-if="showStreakDays && streakStats"
            class="flex justify-start mb-1"
          >
            <StreakDaysIndicator
              :streak-stats="streakStats"
              :target-score="targetScore"
              :is-percentage="isPercentage"
            />
          </div>
          <!-- Use stat-value class with conditional sizing -->
          <div
            class="stat-value"
            :class="{ 'text-lg': showStreakDays }"
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DailyStreakStats } from '~/types/dailyStreakStats'

const props = defineProps<{
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

// Provide the title to child components like StreakDaysIndicator
provide('statBadgeTitle', props.title)
</script>
