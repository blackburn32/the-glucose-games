<template>
  <div class="flex flex-col w-full items-center space-y-8 px-2">
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
    <div
      v-for="achievementGroup in scoredAchievementGroups"
      :key="achievementGroup.name"
      class="flex flex-col w-full items-center space-y-4 max-w-4xl"
    >
      <div class="text-xl font-semibold leading-tight w-full px-2 underline">
        {{ achievementGroup.name }}
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
        <AchievementRow
          v-for="achievement in achievementGroup.achievements"
          :key="achievement.name"
          :name="achievement.name"
          :description="achievement.description"
          :icon="achievement.icon"
          :completed-date="achievement.completed"
          :progress="achievement.progress"
          :goal="achievement.goal"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AchievementRow from '~/components/achievements/AchievementRow.vue'
import { achievementGroups } from '~/utils/achievements/achievements'
import type { Thresholds } from '~/types/thresholds'
import type { GlucoseRecord } from '~/types/glucoseRecord'
import type { AchievementDefinition } from '~/types/achievementDefinition'

const props = defineProps<{
  thresholds?: Thresholds
  glucoseValues?: Ref<GlucoseRecord[]>
}>()

const { scoredGames, glucoseData } = useGlucoseValues(props.glucoseValues, props.thresholds)

const scoreAchievement = (achievementDefinition: AchievementDefinition) => {
  const achievementCompletion = achievementDefinition.condition(scoredGames.value, glucoseData.value)
  return {
    name: achievementDefinition.name,
    description: achievementDefinition.description,
    completed: achievementCompletion.completed?.toLocaleDateString(),
    icon: achievementDefinition.icon,
    progress: achievementCompletion.progress,
    goal: achievementCompletion.goal,
  }
}

const scoredAchievementGroups = computed(() => {
  return achievementGroups.map((group) => {
    return {
      name: group.name,
      achievements: group.achievements.map(scoreAchievement),
    }
  })
})

const scoredAchievements = computed(() => {
  return scoredAchievementGroups.value.flatMap(group => group.achievements)
})

const achievementsCompleted = computed(() => {
  return scoredAchievements.value.filter(achievement => achievement.completed).length
})
const totalAchievements = ref(scoredAchievements.value.length)
const cleanPercentCompleted = computed(() => {
  return Math.floor((achievementsCompleted.value / totalAchievements.value) * 100)
})
</script>
