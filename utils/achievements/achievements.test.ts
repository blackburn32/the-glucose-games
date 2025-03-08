import { test, expect, describe } from 'vitest'
import { achievementGroups } from './achievements'
import {
  daysInRangeAchievementGroup,
  nightsInRangeAchievementGroup,
  daysInRangeAchievements,
  nightsInRangeAchievements,
} from './achievements/daysInRange/daysInRangeAchievements'
import {
  morningsInRangeAchievementGroup,
  afternoonsInRangeAchievementGroup,
  eveningsInRangeAchievementGroup,
  averageInRangeAchievementGroup,
  morningInRangeAchievements,
  afternoonInRangeAchievements,
  eveningInRangeAchievements,
  averageInRangeAchievements,
} from './achievements/averageInRange/averageInRangeAchievements'

describe('Achievement groups', () => {
  test('should export all achievement groups', () => {
    expect(achievementGroups).toHaveLength(6)
    expect(achievementGroups).toContain(daysInRangeAchievementGroup)
    expect(achievementGroups).toContain(nightsInRangeAchievementGroup)
    expect(achievementGroups).toContain(morningsInRangeAchievementGroup)
    expect(achievementGroups).toContain(afternoonsInRangeAchievementGroup)
    expect(achievementGroups).toContain(eveningsInRangeAchievementGroup)
    expect(achievementGroups).toContain(averageInRangeAchievementGroup)
  })

  test('days in range achievement group should contain correct achievements', () => {
    expect(daysInRangeAchievementGroup.name).toBe('Days in range')
    expect(daysInRangeAchievementGroup.achievements).toBe(daysInRangeAchievements)
  })

  test('nights in range achievement group should contain correct achievements', () => {
    expect(nightsInRangeAchievementGroup.name).toBe('Nights in range')
    expect(nightsInRangeAchievementGroup.achievements).toBe(nightsInRangeAchievements)
  })

  test('mornings in range achievement group should contain correct achievements', () => {
    expect(morningsInRangeAchievementGroup.name).toBe('Mornings in range')
    expect(morningsInRangeAchievementGroup.achievements).toBe(morningInRangeAchievements)
  })

  test('afternoons in range achievement group should contain correct achievements', () => {
    expect(afternoonsInRangeAchievementGroup.name).toBe('Afternoons in range')
    expect(afternoonsInRangeAchievementGroup.achievements).toBe(afternoonInRangeAchievements)
  })

  test('evenings in range achievement group should contain correct achievements', () => {
    expect(eveningsInRangeAchievementGroup.name).toBe('Evenings in range')
    expect(eveningsInRangeAchievementGroup.achievements).toBe(eveningInRangeAchievements)
  })

  test('average in range achievement group should contain correct achievements', () => {
    expect(averageInRangeAchievementGroup.name).toBe('Average in range')
    expect(averageInRangeAchievementGroup.achievements).toBe(averageInRangeAchievements)
  })

  test('all achievement groups should have unique names', () => {
    const groupNames = achievementGroups.map(group => group.name)
    const uniqueNames = new Set(groupNames)
    expect(uniqueNames.size).toBe(achievementGroups.length)
  })

  test('all achievement groups should have non-empty achievement lists', () => {
    for (const group of achievementGroups) {
      expect(group.achievements.length).toBeGreaterThan(0)
    }
  })

  test('all achievements should have unique IDs', () => {
    const allAchievements = achievementGroups.flatMap(group => group.achievements)
    const achievementIds = allAchievements.map(achievement => achievement.id)
    const uniqueIds = new Set(achievementIds)
    expect(uniqueIds.size).toBe(allAchievements.length)
  })
})
