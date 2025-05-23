<template>
  <div class="flex flex-col w-full items-center space-y-8 pt-[64px] p-[24px]">
    <div class="flex flex-col items-center text-center w-full md:max-w-lg bg-base-200 px-4 py-2 rounded">
      <div class="w-full font-bold">
        All Achievements
      </div>
      <fieldset
        class="fieldset w-full"
      >
        <div class="fieldset-label">
          <span class="fieldset-label">{{ achievementsCompleted }} of {{ totalAchievements }} completed</span>
          <span class="fieldset-label-alt">({{ cleanPercentCompleted }}%)</span>
        </div>
        <progress
          class="progress progress-primary w-full mb-1"
          :value="achievementsCompleted"
          :max="totalAchievements"
        />
      </fieldset>
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
import type { AchievementDefinition } from '~/types/achievementDefinition'
import type { ScoredGlucoseGames } from '~/types/scoredGlucoseGames'
import type { GlucoseRecord } from '~/types/glucoseRecord'

const nuxtApp = useNuxtApp()
const defaultScoredGames = nuxtApp.$scoredGames
const scoredGames = inject<Ref<ScoredGlucoseGames>>('scoredGamesInjectable', defaultScoredGames)
const defaultGlucoseValues = nuxtApp.$glucoseValues
const glucoseValues = inject<Ref<GlucoseRecord[]>>('glucoseValuesInjectable', defaultGlucoseValues)

const scoreAchievement = (achievementDefinition: AchievementDefinition) => {
  const achievementCompletion = achievementDefinition.condition(scoredGames.value, glucoseValues.value)
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
