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
                    :class="category === '1' ? 'btn-accent' : 'btn-outline'"
                    @click="category = '1'"
                  >
                    Connect
                  </button>
                  <button
                    class="btn btn-sm px-3 py-1 shadow-sm m-1.5"
                    :class="category === '2' ? 'btn-accent' : 'btn-outline'"
                    @click="category = '2'"
                  >
                    Play
                  </button>
                  <button
                    class="btn btn-sm px-3 py-1 shadow-sm m-1.5"
                    :class="category === '3' ? 'btn-accent' : 'btn-outline'"
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
                    The Glucose Games are powered by your continuous glucose monitor data. Connect your Dexcom account to get started.
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
                :data="dataForLineGraph.longestStreak"
                :duration="dataForLineGraph.streakString"
                :low="70"
                :high="category != '2' ? 180 : undefined"
              />
              <div class="flex flex-row pt-2">
                <Icon
                  name="ph:arrow-counter-clockwise"
                  :size="24"
                  class="cursor-pointer"
                  @click="refreshData"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { calculatePercentTimeInRange, cleanPercentForDisplay } from '~/utils/glucoseGames'

const category = ref('1')
const glucoseValues = useState('demoValues', () => generateGlucoseValues(RealisticGeneratorConfig, 1000))

const refreshData = () => {
  glucoseValues.value = generateGlucoseValues(RealisticGeneratorConfig, 1000)
}

const bestStreak = computed(() => {
  return {
    title: 'Best Streak of the Week',
    ...longestStreakWithoutLowsOrHighs(glucoseValues.value, 70, 180),
  }
})
const currentStreak = computed(() => {
  return {
    title: 'Current Streak Without Lows',
    ...longestStreakWithoutLows(glucoseValues.value, 70, true),
  }
})
const lastNight = computed(() => {
  const now = new Date()
  const todayMidnight = new Date()
  todayMidnight.setHours(0, 0, 0, 0)
  const todayMorning = new Date()
  todayMorning.setHours(6, 0, 0, 0)

  const [start, end] = now < todayMorning
    ? [new Date(todayMidnight).setDate(new Date(todayMidnight).getDate() - 1), new Date(todayMorning).setDate(new Date(todayMorning).getDate() - 1)]
    : [todayMidnight, todayMorning]

  const values = glucoseValues.value.filter(record => record.created > start && record.created < end)
  const percentTimeInRange = calculatePercentTimeInRange(values ?? [], { low: 70, high: 180 })
  const cleanPercentTimeInRange = cleanPercentForDisplay(percentTimeInRange)
  return {
    title: 'Time in Range Last Night',
    longestStreak: values,
    streakString: cleanPercentTimeInRange + '%',
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
