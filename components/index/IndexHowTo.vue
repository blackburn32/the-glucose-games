<template>
  <section class="relative border-t border-base-300 w-full items-center">
    <div
      class="absolute top-0 left-0 right-0 bg-gradient-to-b from-base-300 to-transparent opacity-25 h-[25rem] pointer-events-none -z-10"
      aria-hidden="true"
    />

    <div
      class="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 mt-40 pointer-events-none -z-10"
      aria-hidden="true"
    />

    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div class="py-12 md:py-20">
        <div class="max-w-2xl mx-auto text-center pb-12 md:pb-20">
          <h2 class="h2 text-5xl font-hkgrotesk prose">
            Managing your blood glucose can be fun!
          </h2>
        </div>

        <div class="bg-base-300 bg-opacity-60 rounded overflow-hidden">
          <div class="flex flex-col md:flex-row items-end md:items-start md:justify-between lg:space-x-20">
            <div class="md:min-w-[28rem] p-6 lg:p-10">
              <div class="mb-6 lg:mb-8">
                <div class="flex flex-wrap -m-1.5">
                  <button
                    class="btn btn-sm px-3 py-1 shadow-sm m-1.5"
                    :class="category === '1' ? 'btn-accent' : 'btn-soft'"
                    @click="category = '1'"
                  >
                    Connect
                  </button>
                  <button
                    class="btn btn-sm px-3 py-1 shadow-sm m-1.5"
                    :class="category === '2' ? 'btn-accent' : 'btn-soft'"
                    @click="category = '2'"
                  >
                    Play
                  </button>
                  <button
                    class="btn btn-sm px-3 py-1 shadow-sm m-1.5"
                    :class="category === '3' ? 'btn-accent' : 'btn-soft'"
                    @click="category = '3'"
                  >
                    Improve
                  </button>
                </div>
              </div>

              <div class="prose">
                <div v-show="category === '1'">
                  <h3 class="text-2xl font-hkgrotesk mb-2">
                    Connect to your data
                  </h3>
                  <div class="text-lg">
                    The Glucose Games are powered by your continuous glucose monitor data. Connect to your CGM through
                    <NuxtLink
                      :external="true"
                      to="https://nightscout.github.io/"
                    >Nightscout</NuxtLink>
                    to get started.
                  </div>
                </div>
                <div v-show="category === '2'">
                  <h3 class="text-2xl font-hkgrotesk mb-2">
                    Play the games
                  </h3>
                  <div class="text-lg ">
                    Control the games by keeping your blood glucose in range. Try to beat your high scores!
                  </div>
                </div>
                <div v-show="category === '3'">
                  <h3 class="text-2xl font-hkgrotesk mb-2">
                    Improve your control
                  </h3>
                  <div class="text-lg">
                    Keep track of your longest streaks and see how you're improving over time. Discover where you need to focus to improve your control.
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-col w-full max-w-xl py-8 pr-6 pl-2">
              <LineGraph
                class="w-full"
                :title="dataForLineGraph.title"
                :data="dataForLineGraph.streak"
                :duration="dataForLineGraph.streakString"
                :low="70"
                :high="category != '2' ? 180 : undefined"
                :best="dataForLineGraph.best"
              />
              <div
                class="flex flex-row pt-2 cursor-pointer"
                @click="refreshData"
              >
                <Icon
                  name="ph:arrow-counter-clockwise"
                  :size="24"
                />
                <span
                  class="text-sm ml-2 cursor-pointer"
                >
                  Randomize Data
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { contiguousStreakWithNoLows, contiguousStreakWithNoLowsOrHighs } from '~/utils/games/contiguousStreak/contiguousStreakGames'
import { percentTimeInRangeForNightsStreak } from '~/utils/games/percentTimeInRange/percentTimeInRangeGames'
import { generateRandomWalk } from '~/utils/generators/randomWalkGenerator/randomWalkGenerator'
import { RealisticGeneratorConfig } from '~/utils/generators/config/generatorConfig'

const category = ref('1')
const glucoseValues = useState('demoValues', () => generateRandomWalk(RealisticGeneratorConfig, 1000))

const refreshData = () => {
  glucoseValues.value = generateRandomWalk(RealisticGeneratorConfig, 1000)
}

const noLowsStreak = computed(() => {
  return contiguousStreakWithNoLows(glucoseValues.value, { low: 70, high: 180 })
})

const noLowsOrHighsStreak = computed(() => {
  return contiguousStreakWithNoLowsOrHighs(glucoseValues.value, { low: 70, high: 180 })
})

const timeInRange = computed(() => {
  return percentTimeInRangeForNightsStreak(glucoseValues.value, { low: 70, high: 180 }, 1)
})

const bestStreak = computed(() => {
  return {
    title: 'Best Streak',
    streak: noLowsOrHighsStreak.value.longestStreak,
    streakString: noLowsOrHighsStreak.value.longestStreakString,
    best: noLowsOrHighsStreak.value.longestStreakString,
  }
})

const currentStreak = computed(() => {
  return {
    title: 'Current No Lows Streak',
    streak: noLowsStreak.value.currentStreak,
    streakString: noLowsStreak.value.currentStreakString,
    best: noLowsStreak.value.longestStreakString,
  }
})
const lastNight = computed(() => {
  return {
    title: 'Time in Range Last Night',
    streak: timeInRange.value.mostRecentScoredDay?.glucoseRecords ?? [],
    streakString: timeInRange.value.mostRecentScoredDay?.scoreForDisplay + '%',
    best: timeInRange.value.bestDay?.scoreForDisplay + '%',
  }
})

const dataForLineGraph = computed(() => {
  if (category.value === '1') {
    return lastNight.value
  }
  else if (category.value === '2') {
    return currentStreak.value
  }
  else {
    return bestStreak.value
  }
})
</script>
