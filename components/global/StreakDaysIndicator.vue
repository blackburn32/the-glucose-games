<template>
  <div class="flex flex-row w-full justify-evenly">
    <UTooltip
      v-for="(day, index) in mostRecentScoredDays"
      :key="`indicator-${index}`"
      :text="getDayTooltip(day)"
    >
      <div
        class="flex flex-col items-center"
      >
        <div>{{ getDayLabel(day.date) }}</div>
        <Icon
          :name="getIconAndColorForScoredDay(day).name"
          :class="getIconAndColorForScoredDay(day).color"
          size="16"
        />
      </div>
    </UTooltip>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { DailyStreakStats } from '~/types/dailyStreakStats'
import { EveningTiming, NightTiming, MorningTiming, AfternoonTiming } from '~/types/timing'

// Define a type for day objects
interface DayStatus {
  date: Date
  success: boolean | null
  isPending: boolean
  scoreDisplay: string
}

const props = defineProps<{
  streakStats: DailyStreakStats
  title: string
  unit: string
}>()

// Get the title from the parent StatBadge component
const title = inject('statBadgeTitle', '')


// Get the 5 most recent days from the scored days
const recentDays = computed(() => {
  try {
    // Basic safety checks
    if (!props.streakStats || !props.streakStats.scoredDays) {
      return getEmptyDays(5)
    }

    // Get timezone-aware now and today
    const now = new Date()
    const currentHour = now.getHours()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get sorted scored days
    let days = [...props.streakStats.scoredDays]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)

    // Process streak days
    days = days.map((day) => {
      const targetValue = props.targetScore || 80

      const dayDate = new Date(day.date)
      dayDate.setHours(0, 0, 0, 0)
      const isToday = dayDate.getTime() === today.getTime()

      let isSuccess = null
      let scoreDisplay = ''
      let isPending = false

      if (day.scoreForDisplay) {
        if (props.isPercentage) {
          isSuccess = day.score >= targetValue
          scoreDisplay = day.scoreForDisplay + '%'

          // Handle pending status for today based on time periods
          if (isToday) {
            // Determine which timing period we're dealing with based on the title
            const titleLower = title.toLowerCase()

            if (titleLower.includes('evening') && currentHour < EveningTiming.startHour) {
              isSuccess = null
              isPending = true
              scoreDisplay = `After ${EveningTiming.formattedStartTime}`
            }

            else if (titleLower.includes('night') && currentHour < NightTiming.startHour) {
              isSuccess = null
              isPending = true
              scoreDisplay = `After ${NightTiming.formattedStartTime}`
            }

            else if (titleLower.includes('morning') && currentHour < MorningTiming.startHour) {
              isSuccess = null
              isPending = true
              scoreDisplay = `After ${MorningTiming.formattedStartTime}`
            }

            else if (titleLower.includes('afternoon') && currentHour < AfternoonTiming.startHour) {
              isSuccess = null
              isPending = true
              scoreDisplay = `After ${AfternoonTiming.formattedStartTime}`
            }
          }
        }
        else {
          isSuccess = day.passesThreshold === true
          scoreDisplay = day.scoreForDisplay + ' mg/dL'
        }
      }
      else {
        scoreDisplay = 'Unknown'
      }

      return {
        date: day.date,
        success: isSuccess,
        isPending,
        scoreDisplay,
      }
    }).reverse()

    // Check if we need to add today as a pending day
    const hasToday = days.some((day) => {
      const d = new Date(day.date)
      d.setHours(0, 0, 0, 0)
      return d.getTime() === today.getTime()
    })

    // Add pending today if not present and needed
    if (!hasToday && props.isPercentage) {
      // Determine which timing period we're dealing with
      const titleLower = title.toLowerCase()
      let pendingMessage = 'Waiting for data'

      if (titleLower.includes('evening')) {
        pendingMessage = `After ${EveningTiming.formattedStartTime}`
      }
      else if (titleLower.includes('night')) {
        pendingMessage = `After ${NightTiming.formattedStartTime}`
      }
      else if (titleLower.includes('morning')) {
        pendingMessage = `After ${MorningTiming.formattedStartTime}`
      }
      else if (titleLower.includes('afternoon')) {
        pendingMessage = `After ${AfternoonTiming.formattedStartTime}`
      }

      days.push({
        date: today,
        success: null,
        isPending: true,
        scoreDisplay: pendingMessage,
      })
    }

    // Fill empty slots if needed
    while (days.length < 5) {
      days.unshift({
        date: new Date(),
        success: null,
        isPending: false,
        scoreDisplay: 'No data',
      })
    }

    return days
  }
  catch (error) {
    console.error('Error in recentDays computed property:', error)
    return getEmptyDays(5)
  }
})

// Helper function to get empty days
function getEmptyDays(count: number): DayStatus[] {
  const days: DayStatus[] = []
  for (let i = 0; i < count; i++) {
    days.push({
      date: new Date(),
      success: null,
      isPending: false,
      scoreDisplay: 'No data',
    })
  }
  return days
}

// Get a short day label (M, T, W, T, F, S, S)
const getDayLabel = (date: Date) => {
  try {
    const d = new Date(date)
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    return days[d.getDay()]
  }
  catch {
    return ''
  }
}

const getDayTooltip = (day: ScoredDay) => {
  const date = day.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  return `${date}: ${day.scoreForDisplay}${props.unit}`
}
</script>
