<template>
  <div class="flex flex-col w-full items-center space-y-4 px-2">
    <div class="flex flex-col items-center text-center w-full md:max-w-lg bg-base-300 px-4 py-2 rounded">
      <label
        class="form-control w-full"
      >
        <div class="label">
          <span class="label-text">{{ achievementsCompleted }} of {{ totalAchievements }} completed</span>
          <span class="label-text-alt">({{ cleanPercentCompleted }}%)</span>
        </div>
        <progress
          class="progress progress-primary w-full mb-1"
          :value="achievementsCompleted"
          :max="totalAchievements"
        />
      </label>
    </div>
    <AchievementRow
      v-for="achievement in scoredAchievements"
      :key="achievement.name"
      :name="achievement.name"
      :description="achievement.description"
      :icon="achievement.icon"
      :completed-date="achievement.completed"
      :progress="achievement.progress"
      :goal="achievement.goal"
    />
  </div>
</template>

<script setup lang="ts">
import AchievementRow from '~/components/achievements/AchievementRow.vue'
import { allAchievements } from '~/utils/achievements/achievements'
import type { Thresholds } from '~/types/thresholds'
import type { GlucoseRecord } from '~/types/glucoseRecord'

const props = defineProps<{
  thresholds?: Thresholds
  glucoseValues?: Ref<GlucoseRecord[]>
}>()

const { scoredGames, glucoseData } = useGlucoseValues(props.glucoseValues, props.thresholds)

const scoredAchievements = computed(() => {
  return allAchievements.map((achievementDefinition) => {
    const achievementCompletion = achievementDefinition.condition(scoredGames.value, glucoseData.value)
    return {
      name: achievementDefinition.name,
      description: achievementDefinition.description,
      completed: achievementCompletion.completed?.toLocaleDateString(),
      icon: achievementDefinition.icon,
      progress: achievementCompletion.progress,
      goal: achievementCompletion.goal,
    }
  })
})

const achievementsCompleted = computed(() => {
  return scoredAchievements.value.filter(achievement => achievement.completed).length
})
const totalAchievements = ref(scoredAchievements.value.length)
const cleanPercentCompleted = computed(() => {
  return Math.floor((achievementsCompleted.value / totalAchievements.value) * 100)
})
</script>
