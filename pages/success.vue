<template>
  <div class="flex flex-col w-full items-center space-y-4 px-2">
    <div class="text-4xl font-bold mt-10">
      Success
    </div>
    <div>
      <div class="text-2xl">
        You're connected!
      </div>
    </div>
    <div class="md:max-w-xl w-full text-2xl font-bold">
      Previous Day: {{ percentTimeInRangeOverPrevious24Hours.toFixed(2) }}% Time in Range
    </div>
    <div class="md:max-w-xl w-full">
      <LineGraph
        :data="previous24Hours"
        :low="70"
        :high="180"
      />
    </div>
    <div class="md:max-w-xl w-full text-2xl font-bold">
      Best Streak (Last 24h): {{ longestStreakWithoutLowsOrHighsInPrevious24Hours.streakString }}
    </div>
    <div class="md:max-w-xl w-full">
      <LineGraph
        :data="longestStreakWithoutLowsOrHighsInPrevious24Hours.longestStreak"
        :low="70"
        :high="180"
      />
    </div>
    <div class="md:max-w-xl w-full text-2xl font-bold">
      Best No Low Streak (Last 24h): {{ longestStreakWithoutLowsInPrevious24Hours.streakString }}
    </div>
    <div class="md:max-w-xl w-full">
      <LineGraph
        :data="longestStreakWithoutLowsInPrevious24Hours.longestStreak"
        :low="70"
        :high="180"
      />
    </div>
    <div class="md:max-w-xl w-full text-2xl font-bold">
      Best No High Streak (Last 24h): {{ longestStreakWithoutHighsInPrevious24Hours.streakString }}
    </div>
    <div class="md:max-w-xl w-full">
      <LineGraph
        :data="longestStreakWithoutHighsInPrevious24Hours.longestStreak"
        :low="70"
        :high="180"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGlucoseValues } from '~/composables/useGlucoseValues'

const {
  previous24Hours,
  percentTimeInRangeOverPrevious24Hours,
  longestStreakWithoutLowsInPrevious24Hours,
  longestStreakWithoutHighsInPrevious24Hours,
  longestStreakWithoutLowsOrHighsInPrevious24Hours,
} = useGlucoseValues()
</script>
