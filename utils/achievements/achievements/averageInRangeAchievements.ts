import type { AchievementDefinition } from '~/types/achievementDefinition'

export const oneDayAverageInRangeAchievement: AchievementDefinition = {
  id: 'oneDayAverageInRange',
  name: 'Your first average in range day',
  description: 'Score one day with your average in range.',
  icon: 'ph:number-square-one',
  condition: (scoredGames) => {
    const averageInRangeStats = scoredGames.dailyStreakStats.averageInRangeForFullDay
    const daysInRange = averageInRangeStats.streaks.map(streak => streak.streak).flat()
    const earliestDayInRange = daysInRange.sort((a, b) => a.date.getTime() - b.date.getTime()).at(0)
    return {
      completed: earliestDayInRange?.date,
      progress: Math.min(1, daysInRange.length),
      goal: 1,
    }
  },
}

export const fiveDaysAverageInRangeAchievement: AchievementDefinition = {
  id: 'fiveDaysAverageInRange',
  name: 'Five average in range days',
  description: 'Score five days with your average in range.',
  icon: 'ph:number-square-five',
  condition: (scoredGames) => {
    const averageInRangeStats = scoredGames.dailyStreakStats.averageInRangeForFullDay
    const validDaysInOrder = averageInRangeStats.streaks.flatMap(streak => streak.streak)
    const fifthDayInRange = validDaysInOrder.at(4)
    return {
      completed: fifthDayInRange?.date,
      progress: Math.min(5, validDaysInOrder.length),
      goal: 5,
    }
  },
}

export const tenDaysAverageInRangeAchievement: AchievementDefinition = {
  id: 'tenDaysAverageInRange',
  name: 'Ten average in range days',
  description: 'Score ten days with your average in range.',
  icon: 'ph:trend-up',
  condition: (scoredGames) => {
    const averageInRangeStats = scoredGames.dailyStreakStats.averageInRangeForFullDay
    const validDaysInOrder = averageInRangeStats.streaks.flatMap(streak => streak.streak)
    const tenthDayInRange = validDaysInOrder.at(9)
    return {
      completed: tenthDayInRange?.date,
      progress: Math.min(10, validDaysInOrder.length),
      goal: 10,
    }
  },
}

export const twentyFiveDaysAverageInRangeAchievement: AchievementDefinition = {
  id: 'twentyFiveDaysAverageInRange',
  name: 'Twenty-five average in range days',
  description: 'Score twenty-five days with your average in range.',
  icon: 'ph:medal',
  condition: (scoredGames) => {
    const averageInRangeStats = scoredGames.dailyStreakStats.averageInRangeForFullDay
    const validDaysInOrder = averageInRangeStats.streaks.flatMap(streak => streak.streak)
    const twentyFifthDayInRange = validDaysInOrder.at(24)
    return {
      completed: twentyFifthDayInRange?.date,
      progress: Math.min(25, validDaysInOrder.length),
      goal: 25,
    }
  },
}

export const oneHundredDaysAverageInRangeAchievement: AchievementDefinition = {
  id: 'oneHundredDaysAverageInRange',
  name: 'One hundred average in range days',
  description: 'Score one hundred days with your average in range.',
  icon: 'ph:medal',
  condition: (scoredGames) => {
    const averageInRangeStats = scoredGames.dailyStreakStats.averageInRangeForFullDay
    const validDaysInOrder = averageInRangeStats.streaks.flatMap(streak => streak.streak)
    const hundredthDayInRange = validDaysInOrder.at(99)
    return {
      completed: hundredthDayInRange?.date,
      progress: Math.min(100, validDaysInOrder.length),
      goal: 100,
    }
  },
}

export const twoDayAverageInRangeStreakAchievement: AchievementDefinition = {
  id: 'twoDayAverageInRangeStreak',
  name: 'Two-day averange in range streak',
  description: 'Score two days in a row with your average in range.',
  icon: 'ph:number-square-two',
  condition: (scoredGames) => {
    const averageInRangeStats = scoredGames.dailyStreakStats.averageInRangeForFullDay
    const bestStreak = averageInRangeStats.bestStreak
    const twoDayStreaks = averageInRangeStats.streaks.filter(streak => streak.streak.length >= 2)
    return {
      completed: twoDayStreaks.at(0)?.streak.at(1)?.date,
      progress: bestStreak.length,
      goal: 2,
    }
  },
}

export const fiveDayAverageInRangeStreakAchievement: AchievementDefinition = {
  id: 'fiveDayAverageInRangeStreak',
  name: 'Five-day average in range streak',
  description: 'Score five days in a row with your average in range.',
  icon: 'ph:number-square-five',
  condition: (scoredGames) => {
    const averageInRangeStats = scoredGames.dailyStreakStats.averageInRangeForFullDay
    const bestStreak = averageInRangeStats.bestStreak
    const fiveDayStreaks = averageInRangeStats.streaks.filter(streak => streak.streak.length >= 5)
    return {
      completed: fiveDayStreaks.at(0)?.streak.at(4)?.date,
      progress: bestStreak.length,
      goal: 5,
    }
  },
}

export const tenDayAverageInRangeStreakAchievement: AchievementDefinition = {
  id: 'tenDayAverageInRangeStreak',
  name: 'Ten-day average in range streak',
  description: 'Score ten days in a row with your average in range.',
  icon: 'ph:trend-up',
  condition: (scoredGames) => {
    const averageInRangeStats = scoredGames.dailyStreakStats.averageInRangeForFullDay
    const bestStreak = averageInRangeStats.bestStreak
    const tenDayStreaks = averageInRangeStats.streaks.filter(streak => streak.streak.length >= 10)
    return {
      completed: tenDayStreaks.at(0)?.streak.at(9)?.date,
      progress: bestStreak.length,
      goal: 10,
    }
  },
}

export const thirtyDayAverageInRangeStreakAchievement: AchievementDefinition = {
  id: 'thirtyDayAverageInRangeStreak',
  name: 'Thirty-day average in range streak',
  description: 'Score thirty days in a row with your average in range.',
  icon: 'ph:calendar-check',
  condition: (scoredGames) => {
    const averageInRangeStats = scoredGames.dailyStreakStats.averageInRangeForFullDay
    const bestStreak = averageInRangeStats.bestStreak
    const thirtyDayStreaks = averageInRangeStats.streaks.filter(streak => streak.streak.length >= 30)
    return {
      completed: thirtyDayStreaks.at(0)?.streak.at(29)?.date,
      progress: bestStreak.length,
      goal: 30,
    }
  },
}

export const averageInRangeAchievements = [
  oneDayAverageInRangeAchievement,
  fiveDaysAverageInRangeAchievement,
  tenDaysAverageInRangeAchievement,
  twentyFiveDaysAverageInRangeAchievement,
  oneHundredDaysAverageInRangeAchievement,
  twoDayAverageInRangeStreakAchievement,
  fiveDayAverageInRangeStreakAchievement,
  tenDayAverageInRangeStreakAchievement,
  thirtyDayAverageInRangeStreakAchievement,
]

export const oneMorningInRangeAchievement: AchievementDefinition = {
  id: 'oneMorningInRange',
  name: 'Your first morning in range',
  description: 'Score one morning with your blood glucose at least 80% in range.',
  icon: 'ph:sun-dim',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForMornings
    const morningsInRange = timeInRangeStats.streaks.flatMap(streak => streak.streak)
    const earliestMorningInRange = morningsInRange.sort((a, b) => a.date.getTime() - b.date.getTime()).at(0)
    return {
      completed: earliestMorningInRange?.date,
      progress: Math.min(1, morningsInRange.length),
      goal: 1,
    }
  },
}

export const fiveMorningsInRangeAchievement: AchievementDefinition = {
  id: 'fiveMorningsInRange',
  name: 'Five strong mornings',
  description: 'Score five mornings with your blood glucose at least 80% in range.',
  icon: 'ph:sun-dim',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForMornings
    const validMorningsInOrder = timeInRangeStats.streaks.flatMap(streak => streak.streak)
    const fifthMorningInRange = validMorningsInOrder.at(4)
    return {
      completed: fifthMorningInRange?.date,
      progress: Math.min(5, validMorningsInOrder.length),
      goal: 5,
    }
  },
}

export const tenMorningsInRangeAchievement: AchievementDefinition = {
  id: 'tenMorningsInRange',
  name: 'Ten strong mornings',
  description: 'Score ten mornings with your blood glucose at least 80% in range.',
  icon: 'ph:sun-dim',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForMornings
    const validMorningsInOrder = timeInRangeStats.streaks.flatMap(streak => streak.streak)
    const tenthMorningInRange = validMorningsInOrder.at(9)
    return {
      completed: tenthMorningInRange?.date,
      progress: Math.min(10, validMorningsInOrder.length),
      goal: 10,
    }
  },
}

export const twentyFiveMorningsInRangeAchievement: AchievementDefinition = {
  id: 'twentyFiveMorningsInRange',
  name: 'Twenty-five strong mornings',
  description: 'Score twenty-five mornings with your blood glucose at least 80% in range.',
  icon: 'ph:sun-dim',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForMornings
    const validMorningsInOrder = timeInRangeStats.streaks.flatMap(streak => streak.streak)
    const twentyFifthMorningInRange = validMorningsInOrder.at(24)
    return {
      completed: twentyFifthMorningInRange?.date,
      progress: Math.min(25, validMorningsInOrder.length),
      goal: 25,
    }
  },
}

export const oneHundredMorningsInRangeAchievement: AchievementDefinition = {
  id: 'oneHundredMorningsInRange',
  name: 'One hundred strong mornings',
  description: 'Score one hundred mornings with your blood glucose at least 80% in range.',
  icon: 'ph:sun-dim',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForMornings
    const validMorningsInOrder = timeInRangeStats.streaks.flatMap(streak => streak.streak)
    const oneHundredthMorningInRange = validMorningsInOrder.at(99)
    return {
      completed: oneHundredthMorningInRange?.date,
      progress: Math.min(100, validMorningsInOrder.length),
      goal: 100,
    }
  },
}

export const twoMorningStreakInRangeAchievement: AchievementDefinition = {
  id: 'twoMorningStreakInRange',
  name: 'Two mornings in range streak',
  description: 'Score two consecutive mornings with your blood glucose at least 80% in range.',
  icon: 'ph:sun-dim',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForMornings
    const bestStreak = timeInRangeStats.bestStreak
    const twoMorningStreaks = timeInRangeStats.streaks.filter(streak => streak.streak.length >= 2)
    return {
      completed: twoMorningStreaks.at(0)?.streak.at(1)?.date,
      progress: Math.min(2, bestStreak.length),
      goal: 2,
    }
  },
}

export const fiveMorningStreakInRangeAchievement: AchievementDefinition = {
  id: 'fiveMorningStreakInRange',
  name: 'Five mornings in range streak',
  description: 'Score five consecutive mornings with your blood glucose at least 80% in range.',
  icon: 'ph:sun-dim',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForMornings
    const bestStreak = timeInRangeStats.bestStreak
    const fiveMorningStreaks = timeInRangeStats.streaks.filter(streak => streak.streak.length >= 5)
    return {
      completed: fiveMorningStreaks.at(0)?.streak.at(4)?.date,
      progress: Math.min(5, bestStreak.length),
      goal: 5,
    }
  },
}

export const tenMorningStreakInRangeAchievement: AchievementDefinition = {
  id: 'tenMorningStreakInRange',
  name: 'Ten mornings in range streak',
  description: 'Score ten consecutive mornings with your blood glucose at least 80% in range.',
  icon: 'ph:sun-dim',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForMornings
    const bestStreak = timeInRangeStats.bestStreak
    const tenMorningStreaks = timeInRangeStats.streaks.filter(streak => streak.streak.length >= 10)
    return {
      completed: tenMorningStreaks.at(0)?.streak.at(9)?.date,
      progress: Math.min(10, bestStreak.length),
      goal: 10,
    }
  },
}

export const thirtyMorningStreakInRangeAchievement: AchievementDefinition = {
  id: 'thirtyMorningStreakInRange',
  name: 'Thirty mornings in range streak',
  description: 'Score thirty consecutive mornings with your blood glucose at least 80% in range.',
  icon: 'ph:sun-dim',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForMornings
    const bestStreak = timeInRangeStats.bestStreak
    const thirtyMorningStreaks = timeInRangeStats.streaks.filter(streak => streak.streak.length >= 30)
    return {
      completed: thirtyMorningStreaks.at(0)?.streak.at(29)?.date,
      progress: Math.min(30, bestStreak.length),
      goal: 30,
    }
  },
}

export const morningInRangeAchievements = [
  oneMorningInRangeAchievement,
  fiveMorningsInRangeAchievement,
  tenMorningsInRangeAchievement,
  twentyFiveMorningsInRangeAchievement,
  oneHundredMorningsInRangeAchievement,
  twoMorningStreakInRangeAchievement,
  fiveMorningStreakInRangeAchievement,
  tenMorningStreakInRangeAchievement,
  thirtyMorningStreakInRangeAchievement,
]

export const oneAfternoonInRangeAchievement: AchievementDefinition = {
  id: 'oneAfternoonInRange',
  name: 'Your first afternoon in range',
  description: 'Score one afternoon with your blood glucose at least 80% in range.',
  icon: 'ph:sun',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForAfternoons
    const afternoonsInRange = timeInRangeStats.streaks.flatMap(streak => streak.streak)
    const earliestAfternoonInRange = afternoonsInRange.sort((a, b) => a.date.getTime() - b.date.getTime()).at(0)
    return {
      completed: earliestAfternoonInRange?.date,
      progress: Math.min(1, afternoonsInRange.length),
      goal: 1,
    }
  },
}

export const fiveAfternoonsInRangeAchievement: AchievementDefinition = {
  id: 'fiveAfternoonsInRange',
  name: 'Five strong afternoons',
  description: 'Score five afternoons with your blood glucose at least 80% in range.',
  icon: 'ph:sun',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForAfternoons
    const validAfternoonsInOrder = timeInRangeStats.streaks.flatMap(streak => streak.streak)
    const fifthAfternoonInRange = validAfternoonsInOrder.at(4)
    return {
      completed: fifthAfternoonInRange?.date,
      progress: Math.min(5, validAfternoonsInOrder.length),
      goal: 5,
    }
  },
}

export const tenAfternoonsInRangeAchievement: AchievementDefinition = {
  id: 'tenAfternoonsInRange',
  name: 'Ten strong afternoons',
  description: 'Score ten afternoons with your blood glucose at least 80% in range.',
  icon: 'ph:sun',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForAfternoons
    const validAfternoonsInOrder = timeInRangeStats.streaks.flatMap(streak => streak.streak)
    const tenthAfternoonInRange = validAfternoonsInOrder.at(9)
    return {
      completed: tenthAfternoonInRange?.date,
      progress: Math.min(10, validAfternoonsInOrder.length),
      goal: 10,
    }
  },
}

export const twentyFiveAfternoonsInRangeAchievement: AchievementDefinition = {
  id: 'twentyFiveAfternoonsInRange',
  name: 'Twenty-five strong afternoons',
  description: 'Score twenty-five afternoons with your blood glucose at least 80% in range.',
  icon: 'ph:sun',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForAfternoons
    const validAfternoonsInOrder = timeInRangeStats.streaks.flatMap(streak => streak.streak)
    const twentyFifthAfternoonInRange = validAfternoonsInOrder.at(24)
    return {
      completed: twentyFifthAfternoonInRange?.date,
      progress: Math.min(25, validAfternoonsInOrder.length),
      goal: 25,
    }
  },
}

export const oneHundredAfternoonsInRangeAchievement: AchievementDefinition = {
  id: 'oneHundredAfternoonsInRange',
  name: 'One hundred strong afternoons',
  description: 'Score one hundred afternoons with your blood glucose at least 80% in range.',
  icon: 'ph:sun',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForAfternoons
    const validAfternoonsInOrder = timeInRangeStats.streaks.flatMap(streak => streak.streak)
    const oneHundredthAfternoonInRange = validAfternoonsInOrder.at(99)
    return {
      completed: oneHundredthAfternoonInRange?.date,
      progress: Math.min(100, validAfternoonsInOrder.length),
      goal: 100,
    }
  },
}

export const twoAfternoonStreakInRangeAchievement: AchievementDefinition = {
  id: 'twoAfternoonStreakInRange',
  name: 'Two afternoons in range streak',
  description: 'Score two consecutive afternoons with your blood glucose at least 80% in range.',
  icon: 'ph:sun',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForAfternoons
    const bestStreak = timeInRangeStats.bestStreak
    const twoAfternoonStreaks = timeInRangeStats.streaks.filter(streak => streak.streak.length >= 2)
    return {
      completed: twoAfternoonStreaks.at(0)?.streak.at(1)?.date,
      progress: Math.min(2, bestStreak.length),
      goal: 2,
    }
  },
}

export const fiveAfternoonStreakInRangeAchievement: AchievementDefinition = {
  id: 'fiveAfternoonStreakInRange',
  name: 'Five afternoons in range streak',
  description: 'Score five consecutive afternoons with your blood glucose at least 80% in range.',
  icon: 'ph:sun',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForAfternoons
    const bestStreak = timeInRangeStats.bestStreak
    const fiveAfternoonStreaks = timeInRangeStats.streaks.filter(streak => streak.streak.length >= 5)
    return {
      completed: fiveAfternoonStreaks.at(0)?.streak.at(4)?.date,
      progress: Math.min(5, bestStreak.length),
      goal: 5,
    }
  },
}

export const tenAfternoonStreakInRangeAchievement: AchievementDefinition = {
  id: 'tenAfternoonStreakInRange',
  name: 'Ten afternoons in range streak',
  description: 'Score ten consecutive afternoons with your blood glucose at least 80% in range.',
  icon: 'ph:sun',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForAfternoons
    const bestStreak = timeInRangeStats.bestStreak
    const tenAfternoonStreaks = timeInRangeStats.streaks.filter(streak => streak.streak.length >= 10)
    return {
      completed: tenAfternoonStreaks.at(0)?.streak.at(9)?.date,
      progress: Math.min(10, bestStreak.length),
      goal: 10,
    }
  },
}

export const thirtyAfternoonStreakInRangeAchievement: AchievementDefinition = {
  id: 'thirtyAfternoonStreakInRange',
  name: 'Thirty afternoons in range streak',
  description: 'Score thirty consecutive afternoons with your blood glucose at least 80% in range.',
  icon: 'ph:sun',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForAfternoons
    const bestStreak = timeInRangeStats.bestStreak
    const thirtyAfternoonStreaks = timeInRangeStats.streaks.filter(streak => streak.streak.length >= 30)
    return {
      completed: thirtyAfternoonStreaks.at(0)?.streak.at(29)?.date,
      progress: Math.min(30, bestStreak.length),
      goal: 30,
    }
  },
}

export const afternoonInRangeAchievements = [
  oneAfternoonInRangeAchievement,
  fiveAfternoonsInRangeAchievement,
  tenAfternoonsInRangeAchievement,
  twentyFiveAfternoonsInRangeAchievement,
  oneHundredAfternoonsInRangeAchievement,
  twoAfternoonStreakInRangeAchievement,
  fiveAfternoonStreakInRangeAchievement,
  tenAfternoonStreakInRangeAchievement,
  thirtyAfternoonStreakInRangeAchievement,
]
export const oneEveningInRangeAchievement: AchievementDefinition = {
  id: 'oneEveningInRange',
  name: 'Your first evening in range',
  description: 'Score one evening with your blood glucose at least 80% in range.',
  icon: 'ph:sun-horizon',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForEvenings
    const eveningsInRange = timeInRangeStats.streaks.flatMap(streak => streak.streak)
    const earliestEveningInRange = eveningsInRange.sort((a, b) => a.date.getTime() - b.date.getTime()).at(0)
    return {
      completed: earliestEveningInRange?.date,
      progress: Math.min(1, eveningsInRange.length),
      goal: 1,
    }
  },
}

export const fiveEveningsInRangeAchievement: AchievementDefinition = {
  id: 'fiveEveningsInRange',
  name: 'Five strong evenings',
  description: 'Score five evenings with your blood glucose at least 80% in range.',
  icon: 'ph:sun-horizon',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForEvenings
    const validEveningsInOrder = timeInRangeStats.streaks.flatMap(streak => streak.streak)
    const fifthEveningInRange = validEveningsInOrder.at(4)
    return {
      completed: fifthEveningInRange?.date,
      progress: Math.min(5, validEveningsInOrder.length),
      goal: 5,
    }
  },
}

export const tenEveningsInRangeAchievement: AchievementDefinition = {
  id: 'tenEveningsInRange',
  name: 'Ten strong evenings',
  description: 'Score ten evenings with your blood glucose at least 80% in range.',
  icon: 'ph:sun-horizon',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForEvenings
    const validEveningsInOrder = timeInRangeStats.streaks.flatMap(streak => streak.streak)
    const tenthEveningInRange = validEveningsInOrder.at(9)
    return {
      completed: tenthEveningInRange?.date,
      progress: Math.min(10, validEveningsInOrder.length),
      goal: 10,
    }
  },
}

export const twentyFiveEveningsInRangeAchievement: AchievementDefinition = {
  id: 'twentyFiveEveningsInRange',
  name: 'Twenty-five strong evenings',
  description: 'Score twenty-five evenings with your blood glucose at least 80% in range.',
  icon: 'ph:sun-horizon',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForEvenings
    const validEveningsInOrder = timeInRangeStats.streaks.flatMap(streak => streak.streak)
    const twentyFifthEveningInRange = validEveningsInOrder.at(24)
    return {
      completed: twentyFifthEveningInRange?.date,
      progress: Math.min(25, validEveningsInOrder.length),
      goal: 25,
    }
  },
}

export const oneHundredEveningsInRangeAchievement: AchievementDefinition = {
  id: 'oneHundredEveningsInRange',
  name: 'One hundred strong evenings',
  description: 'Score one hundred evenings with your blood glucose at least 80% in range.',
  icon: 'ph:sun-horizon',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForEvenings
    const validEveningsInOrder = timeInRangeStats.streaks.flatMap(streak => streak.streak)
    const oneHundredthEveningInRange = validEveningsInOrder.at(99)
    return {
      completed: oneHundredthEveningInRange?.date,
      progress: Math.min(100, validEveningsInOrder.length),
      goal: 100,
    }
  },
}

export const twoEveningStreakInRangeAchievement: AchievementDefinition = {
  id: 'twoEveningStreakInRange',
  name: 'Two evenings in range streak',
  description: 'Score two consecutive evenings with your blood glucose at least 80% in range.',
  icon: 'ph:sun-horizon',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForEvenings
    const bestStreak = timeInRangeStats.bestStreak
    const twoEveningStreaks = timeInRangeStats.streaks.filter(streak => streak.streak.length >= 2)
    return {
      completed: twoEveningStreaks.at(0)?.streak.at(1)?.date,
      progress: Math.min(2, bestStreak.length),
      goal: 2,
    }
  },
}

export const fiveEveningStreakInRangeAchievement: AchievementDefinition = {
  id: 'fiveEveningStreakInRange',
  name: 'Five evenings in range streak',
  description: 'Score five consecutive evenings with your blood glucose at least 80% in range.',
  icon: 'ph:sun-horizon',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForEvenings
    const bestStreak = timeInRangeStats.bestStreak
    const fiveEveningStreaks = timeInRangeStats.streaks.filter(streak => streak.streak.length >= 5)
    return {
      completed: fiveEveningStreaks.at(0)?.streak.at(4)?.date,
      progress: Math.min(5, bestStreak.length),
      goal: 5,
    }
  },
}

export const tenEveningStreakInRangeAchievement: AchievementDefinition = {
  id: 'tenEveningStreakInRange',
  name: 'Ten evenings in range streak',
  description: 'Score ten consecutive evenings with your blood glucose at least 80% in range.',
  icon: 'ph:sun-horizon',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForEvenings
    const bestStreak = timeInRangeStats.bestStreak
    const tenEveningStreaks = timeInRangeStats.streaks.filter(streak => streak.streak.length >= 10)
    return {
      completed: tenEveningStreaks.at(0)?.streak.at(9)?.date,
      progress: Math.min(10, bestStreak.length),
      goal: 10,
    }
  },
}

export const thirtyEveningStreakInRangeAchievement: AchievementDefinition = {
  id: 'thirtyEveningStreakInRange',
  name: 'Thirty evenings in range streak',
  description: 'Score thirty consecutive evenings with your blood glucose at least 80% in range.',
  icon: 'ph:sun-horizon',
  condition: (scoredGames) => {
    const timeInRangeStats = scoredGames.dailyStreakStats.percentTimeInRangeForEvenings
    const bestStreak = timeInRangeStats.bestStreak
    const thirtyEveningStreaks = timeInRangeStats.streaks.filter(streak => streak.streak.length >= 30)
    return {
      completed: thirtyEveningStreaks.at(0)?.streak.at(29)?.date,
      progress: Math.min(30, bestStreak.length),
      goal: 30,
    }
  },
}

export const eveningInRangeAchievements = [
  oneEveningInRangeAchievement,
  fiveEveningsInRangeAchievement,
  tenEveningsInRangeAchievement,
  twentyFiveEveningsInRangeAchievement,
  oneHundredEveningsInRangeAchievement,
  twoEveningStreakInRangeAchievement,
  fiveEveningStreakInRangeAchievement,
  tenEveningStreakInRangeAchievement,
  thirtyEveningStreakInRangeAchievement,
]
