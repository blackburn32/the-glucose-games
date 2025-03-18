import type { GlucoseRecord } from '~/types/glucoseRecord'
import type { MedalType } from '~/types/constants'
import type { ScoreCheckResult } from '~/types/scoreCheckResult'

export type ScoredDay = {
  date: Date
  glucoseRecords: GlucoseRecord[]
  score: number
  scoreResult: ScoreCheckResult
  scoreForDisplay: string
  passesThreshold: boolean
  medal: MedalType | undefined
}
