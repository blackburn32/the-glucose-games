export interface GlucoseRecord {
  created: Date
  value: number
  x: number
  y: number
  provider: string
  trend?: string | undefined
  trendRate?: number | undefined
  unit?: string | undefined
  rateUnit?: string | undefined
}
