import type { AchievementDefinition } from '~/types/achievementDefinition'

export const oneDayInRangeAchievement: AchievementDefinition = {
  id: 'oneDayInRange',
  name: 'A strong day',
  description: 'Spend a day with your blood glucose at least 80% in range.',
  icon: 'ph:number-square-one',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForFullDay
    const daysInRange = timeInRangeStats.scoredDays
    const bestDay = timeInRangeStats.bestDay
    const earliestDayInRange = daysInRange.sort((a, b) => a.date.getTime() - b.date.getTime()).at(0)
    return {
      completed: earliestDayInRange?.date,
      progress: Math.min(80, bestDay?.score || 0),
      goal: 80,
    }
  },
}

export const fiveDaysInRangeAchievement: AchievementDefinition = {
  id: 'fiveDaysInRange',
  name: 'Five strong days',
  description: 'Score five days with your blood glucose at least 80% in range.',
  icon: 'ph:number-square-five',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForFullDay
    const validDaysInOrder = timeInRangeStats.streaks.flatMap(streak => streak.streak)
    const fifthDayInRange = validDaysInOrder.at(4)
    return {
      completed: fifthDayInRange?.date,
      progress: Math.min(5, validDaysInOrder.length),
      goal: 5,
    }
  },
}

export const tenDaysInRangeAchievement: AchievementDefinition = {
  id: 'tenDaysInRange',
  name: 'Ten strong days',
  description: 'Score ten days with your blood glucose at least 80% in range.',
  icon: 'ph:trend-up',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForFullDay
    const validDaysInOrder = timeInRangeStats.streaks.flatMap(streak => streak.streak)
    const tenthDayInRange = validDaysInOrder.at(9)
    return {
      completed: tenthDayInRange?.date,
      progress: Math.min(10, validDaysInOrder.length),
      goal: 10,
    }
  },
}

export const twentyFiveDaysInRangeAchievement: AchievementDefinition = {
  id: 'twentyFiveDaysInRange',
  name: 'Twenty-five strong days',
  description: 'Score twenty-five days with your blood glucose at least 80% in range.',
  icon: 'ph:medal',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForFullDay
    const validDaysInOrder = timeInRangeStats.streaks.flatMap(streak => streak.streak)
    const twentyFifthDayInRange = validDaysInOrder.at(24)
    return {
      completed: twentyFifthDayInRange?.date,
      progress: Math.min(25, validDaysInOrder.length),
      goal: 25,
    }
  },
}

export const oneHundredsDaysInRangeAchievement: AchievementDefinition = {
  id: 'oneHundredsDaysInRange',
  name: 'One hundred strong days',
  description: 'Score one hundred days with your blood glucose at least 80% in range.',
  icon: 'ph:crown',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForFullDay
    const validDaysInOrder = timeInRangeStats.streaks.flatMap(streak => streak.streak)
    const oneHundredthDayInRange = validDaysInOrder.at(99)
    return {
      completed: oneHundredthDayInRange?.date,
      progress: Math.min(100, validDaysInOrder.length),
      goal: 100,
    }
  },
}

export const twoDayStreakInRangeAchievement: AchievementDefinition = {
  id: 'twoDayStreakInRange',
  name: 'Two day in range streak',
  description: 'Score two consecutive days with your blood glucose at least 80% in range.',
  icon: 'ph:number-square-two',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForFullDay
    const bestStreak = timeInRangeStats.bestStreak
    const twoDayStreaks = timeInRangeStats.streaks.filter(streak => streak.streak.length >= 2)
    return {
      completed: twoDayStreaks.at(0)?.streak.at(1)?.date,
      progress: Math.min(2, bestStreak.length),
      goal: 2,
    }
  },
}

export const fiveDayStreakInRangeAchievement: AchievementDefinition = {
  id: 'fiveDayStreakInRange',
  name: 'Five day in range streak',
  description: 'Score five consecutive days with your blood glucose at least 80% in range.',
  icon: 'ph:number-square-five',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForFullDay
    const bestStreak = timeInRangeStats.bestStreak
    const fiveDayStreaks = timeInRangeStats.streaks.filter(streak => streak.streak.length >= 5)
    return {
      completed: fiveDayStreaks.at(0)?.streak.at(4)?.date,
      progress: Math.min(5, bestStreak.length),
      goal: 5,
    }
  },
}

export const tenDayStreakInRangeAchievement: AchievementDefinition = {
  id: 'tenDayStreakInRange',
  name: 'Ten day in range streak',
  description: 'Score ten consecutive days with your blood glucose at least 80% in range.',
  icon: 'ph:trend-up',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForFullDay
    const bestStreak = timeInRangeStats.bestStreak
    const tenDayStreaks = timeInRangeStats.streaks.filter(streak => streak.streak.length >= 10)
    return {
      completed: tenDayStreaks.at(0)?.streak.at(9)?.date,
      progress: Math.min(10, bestStreak.length),
      goal: 10,
    }
  },
}

export const thirtyDayStreakInRangeAchievement: AchievementDefinition = {
  id: 'thirtyDayStreakInRange',
  name: 'Thirty day in range streak ',
  description: 'Score thirty consecutive days with your blood glucose at least 80% in range.',
  icon: 'ph:calendar-check',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForFullDay
    const bestStreak = timeInRangeStats.bestStreak
    const thirtyDayStreaks = timeInRangeStats.streaks.filter(streak => streak.streak.length >= 30)
    return {
      completed: thirtyDayStreaks.at(0)?.streak.at(29)?.date,
      progress: Math.min(30, bestStreak.length),
      goal: 30,
    }
  },
}

export const daysInRangeAchievements = [
  oneDayInRangeAchievement,
  fiveDaysInRangeAchievement,
  tenDaysInRangeAchievement,
  twentyFiveDaysInRangeAchievement,
  oneHundredsDaysInRangeAchievement,
  twoDayStreakInRangeAchievement,
  fiveDayStreakInRangeAchievement,
  tenDayStreakInRangeAchievement,
  thirtyDayStreakInRangeAchievement,
]
