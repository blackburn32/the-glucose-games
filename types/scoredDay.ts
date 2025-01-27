import type { GlucoseRecord } from '~/types/glucoseRecord'

export type ScoredDay = {
  date: Date
  glucoseRecords: GlucoseRecord[]
  score: number
  scoreForDisplay: string
  passesThreshold: boolean
}
