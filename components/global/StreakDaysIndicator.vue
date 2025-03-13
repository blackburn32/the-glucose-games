<template>
  <div class="flex flex-col items-start streak-component relative">
    <!-- Days of the week labels -->
    <div class="flex space-x-1 text-xs opacity-70">
      <div
        v-for="(day, index) in recentDays"
        :key="`label-${index}`"
        class="w-5 h-5 flex items-center justify-center"
      >
        {{ getDayLabel(day.date) }}
      </div>
    </div>

    <!-- Status indicators with tooltips -->
    <div class="flex space-x-1 streak-indicators-container">
      <div
        v-for="(day, index) in recentDays"
        :key="`indicator-${index}`"
        class="w-5 h-5 flex items-center justify-center relative group"
        :class="{ 'border border-base-300 rounded-full': day.isPending }"
        aria-haspopup="true"
        :aria-label="getDayTooltipLabel(day)"
        @mouseenter="showTooltip($event, index, day)"
        @mouseleave="hideTooltip"
      >
        <Icon
          v-if="day.success === true"
          name="ph:check-circle-fill"
          class="text-success"
          size="18"
        />
        <Icon
          v-else-if="day.success === false"
          name="ph:x-circle-fill"
          class="text-error"
          size="18"
        />
        <Icon
          v-else-if="day.isPending"
          name="ph:clock-fill"
          class="text-base-content opacity-50"
          size="18"
        />
        <Icon
          v-else
          name="ph:question-fill"
          class="text-base-content opacity-50"
          size="18"
        />
      </div>
    </div>
  </div>

  <!-- Teleport tooltip to document body -->
  <ClientOnly>
    <Teleport to="body">
      <div
        v-show="tooltipVisible"
        class="fixed pointer-events-none z-[9999]"
        :style="tooltipStyle"
        role="tooltip"
        aria-live="polite"
      >
        <div class="unovis-style-tooltip">
          <span class="font-semibold">{{ tooltipDate }}</span>:
          {{ tooltipText }}
        </div>
      </div>
    </Teleport>
  </ClientOnly>
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
  targetScore?: number
  isPercentage?: boolean
}>()

// Get the title from the parent StatBadge component
const title = inject('statBadgeTitle', '')

// Tooltip state
const tooltipVisible = ref(false)
const tooltipStyle = ref({
  top: '0px',
  left: '0px',
  transform: 'translate(-50%, -100%)',
})
const tooltipDate = ref('')
const tooltipText = ref('')

// Show tooltip when hovering over indicator
const showTooltip = (event: MouseEvent, index: number, day: DayStatus) => {
  // Get element position
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()

  // Calculate position (in the middle of the element, above it)
  const left = rect.left + (rect.width / 2)
  const top = rect.top

  // Update tooltip data
  tooltipDate.value = formatDate(day.date)
  tooltipText.value = day.scoreDisplay
  tooltipStyle.value = {
    top: `${top}px`,
    left: `${left}px`,
    transform: 'translate(-50%, -100%)',
  }

  // Show tooltip
  tooltipVisible.value = true
}

// Hide tooltip
const hideTooltip = () => {
  tooltipVisible.value = false
}

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

// Format date for tooltip display
const formatDate = (date: Date) => {
  try {
    if (!date) return ''
    const d = new Date(date)
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }
  catch {
    return ''
  }
}

// Get tooltip label for aria-label
const getDayTooltipLabel = (day: DayStatus) => {
  try {
    return `${formatDate(day.date)}: ${day.scoreDisplay}`
  }
  catch {
    return 'Day information'
  }
}
</script>

<style scoped>
.unovis-style-tooltip {
  padding: 6px 10px;
  background-color: oklch(0.243535 0 0);
  color: #fff;
  border-radius: 4px;
  font-size: 0.75rem;
  white-space: nowrap;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  margin-bottom: 8px;
  max-width: 250px;
}
</style>
