import type { GlucoseRecord } from '~/types/glucoseRecord'

export type GameDisplayStats = {
  title: string
  data: GlucoseRecord[]
  description?: string | undefined
  best?: string | undefined
}
