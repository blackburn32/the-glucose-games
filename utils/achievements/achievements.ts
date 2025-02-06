import type { AchievementDefinition } from '~/types/achievementDefinition'
import { daysInRangeAchievements } from '~/utils/achievements/achievements/daysInRangeAchievements'

export const allAchievements: AchievementDefinition[] = [
  ...daysInRangeAchievements,
]
