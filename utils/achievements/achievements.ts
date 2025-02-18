import type { AchievementGroup } from '~/types/achievementDefinition'
import { daysInRangeAchievementGroup, nightsInRangeAchievementGroup } from '~/utils/achievements/achievements/daysInRangeAchievements'
import { afternoonsInRangeAchievementGroup, averageInRangeAchievementGroup, eveningsInRangeAchievementGroup, morningsInRangeAchievementGroup } from '~/utils/achievements/achievements/averageInRangeAchievements'

export const achievementGroups: AchievementGroup[] = [
  daysInRangeAchievementGroup,
  nightsInRangeAchievementGroup,
  morningsInRangeAchievementGroup,
  afternoonsInRangeAchievementGroup,
  eveningsInRangeAchievementGroup,
  averageInRangeAchievementGroup,
]
