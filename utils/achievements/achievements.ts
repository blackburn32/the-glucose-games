import type { AchievementDefinition } from '~/types/achievementDefinition'
import { daysInRangeAchievements, nightsInRangeAchievements } from '~/utils/achievements/achievements/daysInRangeAchievements'
import { afternoonInRangeAchievements, averageInRangeAchievements, eveningInRangeAchievements, morningInRangeAchievements } from '~/utils/achievements/achievements/averageInRangeAchievements'

export const allAchievements: AchievementDefinition[] = [
  ...daysInRangeAchievements,
  ...nightsInRangeAchievements,
  ...morningInRangeAchievements,
  ...afternoonInRangeAchievements,
  ...eveningInRangeAchievements,
  ...averageInRangeAchievements,
]
