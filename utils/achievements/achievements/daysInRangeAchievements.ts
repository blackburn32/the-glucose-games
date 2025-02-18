import type { AchievementDefinition, AchievementGroup } from '~/types/achievementDefinition'

export const oneDayInRangeAchievement: AchievementDefinition = {
  id: 'oneDayInRange',
  name: 'A strong day',
  description: 'Spend a day with your blood glucose at least 80% in range.',
  icon: 'ph:number-square-one',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForFullDay
    const daysInRange = timeInRangeStats.streaks.flatMap(streak => streak.streak)
    const earliestDayInRange = daysInRange.sort((a, b) => a.date.getTime() - b.date.getTime()).at(0)
    return {
      completed: earliestDayInRange?.date,
      progress: Math.min(1, daysInRange.length),
      goal: 1,
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

export const daysInRangeAchievementGroup: AchievementGroup = {
  name: 'Days in range',
  achievements: daysInRangeAchievements,
}

export const oneNightInRangeAchievement: AchievementDefinition = {
  id: 'oneNightInRange',
  name: 'A strong night',
  description: 'Spend a night with your blood glucose at least 80% in range.',
  icon: 'ph:bed',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForNights
    const nightsInRange = timeInRangeStats.streaks.flatMap(streak => streak.streak)
    const earliestNightInRange = nightsInRange.sort((a, b) => a.date.getTime() - b.date.getTime()).at(0)
    return {
      completed: earliestNightInRange?.date,
      progress: Math.min(1, nightsInRange.length),
      goal: 1,
    }
  },
}

export const fiveNightsInRangeAchievement: AchievementDefinition = {
  id: 'fiveNightsInRange',
  name: 'Five strong nights',
  description: 'Score five nights with your blood glucose at least 80% in range.',
  icon: 'ph:bed',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForNights
    const validNightsInOrder = timeInRangeStats.streaks.flatMap(streak => streak.streak)
    const fifthNightInRange = validNightsInOrder.at(4)
    return {
      completed: fifthNightInRange?.date,
      progress: Math.min(5, validNightsInOrder.length),
      goal: 5,
    }
  },
}

export const tenNightsInRangeAchievement: AchievementDefinition = {
  id: 'tenNightsInRange',
  name: 'Ten strong nights',
  description: 'Score ten nights with your blood glucose at least 80% in range.',
  icon: 'ph:bed',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForNights
    const validNightsInOrder = timeInRangeStats.streaks.flatMap(streak => streak.streak)
    const tenthNightInRange = validNightsInOrder.at(9)
    return {
      completed: tenthNightInRange?.date,
      progress: Math.min(10, validNightsInOrder.length),
      goal: 10,
    }
  },
}

export const twentyFiveNightsInRangeAchievement: AchievementDefinition = {
  id: 'twentyFiveNightsInRange',
  name: 'Twenty-five strong nights',
  description: 'Score twenty-five nights with your blood glucose at least 80% in range.',
  icon: 'ph:bed',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForNights
    const validNightsInOrder = timeInRangeStats.streaks.flatMap(streak => streak.streak)
    const twentyFifthNightInRange = validNightsInOrder.at(24)
    return {
      completed: twentyFifthNightInRange?.date,
      progress: Math.min(25, validNightsInOrder.length),
      goal: 25,
    }
  },
}

export const oneHundredNightsInRangeAchievement: AchievementDefinition = {
  id: 'oneHundredNightsInRange',
  name: 'One hundred strong nights',
  description: 'Score one hundred nights with your blood glucose at least 80% in range.',
  icon: 'ph:bed',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForNights
    const validNightsInOrder = timeInRangeStats.streaks.flatMap(streak => streak.streak)
    const oneHundredthNightInRange = validNightsInOrder.at(99)
    return {
      completed: oneHundredthNightInRange?.date,
      progress: Math.min(100, validNightsInOrder.length),
      goal: 100,
    }
  },
}

export const twoNightStreakInRangeAchievement: AchievementDefinition = {
  id: 'twoNightStreakInRange',
  name: 'Two nights in range streak',
  description: 'Score two consecutive nights with your blood glucose at least 80% in range.',
  icon: 'ph:bed',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForNights
    const bestStreak = timeInRangeStats.bestStreak
    const twoNightStreaks = timeInRangeStats.streaks.filter(streak => streak.streak.length >= 2)
    return {
      completed: twoNightStreaks.at(0)?.streak.at(1)?.date,
      progress: Math.min(2, bestStreak.length),
      goal: 2,
    }
  },
}

export const fiveNightStreakInRangeAchievement: AchievementDefinition = {
  id: 'fiveNightStreakInRange',
  name: 'Five nights in range streak',
  description: 'Score five consecutive nights with your blood glucose at least 80% in range.',
  icon: 'ph:bed',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForNights
    const bestStreak = timeInRangeStats.bestStreak
    const fiveNightStreaks = timeInRangeStats.streaks.filter(streak => streak.streak.length >= 5)
    return {
      completed: fiveNightStreaks.at(0)?.streak.at(4)?.date,
      progress: Math.min(5, bestStreak.length),
      goal: 5,
    }
  },
}

export const tenNightStreakInRangeAchievement: AchievementDefinition = {
  id: 'tenNightStreakInRange',
  name: 'Ten nights in range streak',
  description: 'Score ten consecutive nights with your blood glucose at least 80% in range.',
  icon: 'ph:bed',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForNights
    const bestStreak = timeInRangeStats.bestStreak
    const tenNightStreaks = timeInRangeStats.streaks.filter(streak => streak.streak.length >= 10)
    return {
      completed: tenNightStreaks.at(0)?.streak.at(9)?.date,
      progress: Math.min(10, bestStreak.length),
      goal: 10,
    }
  },
}

export const thirtyNightStreakInRangeAchievement: AchievementDefinition = {
  id: 'thirtyNightStreakInRange',
  name: 'Thirty nights in range streak',
  description: 'Score thirty consecutive nights with your blood glucose at least 80% in range.',
  icon: 'ph:bed',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForNights
    const bestStreak = timeInRangeStats.bestStreak
    const thirtyNightStreaks = timeInRangeStats.streaks.filter(streak => streak.streak.length >= 30)
    return {
      completed: thirtyNightStreaks.at(0)?.streak.at(29)?.date,
      progress: Math.min(30, bestStreak.length),
      goal: 30,
    }
  },
}

export const nightsInRangeAchievements = [
  oneNightInRangeAchievement,
  fiveNightsInRangeAchievement,
  tenNightsInRangeAchievement,
  twentyFiveNightsInRangeAchievement,
  oneHundredNightsInRangeAchievement,
  twoNightStreakInRangeAchievement,
  fiveNightStreakInRangeAchievement,
  tenNightStreakInRangeAchievement,
  thirtyNightStreakInRangeAchievement,
]

export const nightsInRangeAchievementGroup: AchievementGroup = {
  name: 'Nights in range',
  achievements: nightsInRangeAchievements,
}
