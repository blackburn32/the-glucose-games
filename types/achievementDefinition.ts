import type { ScoredGlucoseGames } from '~/types/scoredGlucoseGames'
import type { GlucoseRecord } from '~/types/glucoseRecord'

export type AchievementCompletion = {
  completed?: Date | undefined
  progress?: number | undefined
  goal?: number | undefined
}

export type AchievementDefinition = {
  id: string
  name: string
  description: string
  icon: string
  condition: (scoredGames: ScoredGlucoseGames, allRecords: GlucoseRecord[]) => AchievementCompletion
}

export type AchievementGroup = {
  name: string
  achievements: AchievementDefinition[]
}
