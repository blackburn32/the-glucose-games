export interface GlucoseRecord {
  created: string
  value: number
  provider: string
  trend?: string | undefined
  trendRate?: number | undefined
  unit?: string | undefined
  rateUnit?: string | undefined
}
