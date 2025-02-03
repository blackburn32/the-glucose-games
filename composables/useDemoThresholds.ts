import type { Thresholds } from '~/types/thresholds'

export const useDemoThresholds = () => {
  const thresholds = useState<Thresholds>('demoThresholds', () => {
    return {
      low: 70,
      high: 180,
    }
  })

  const setThresholds = (newThresholds: Thresholds) => {
    thresholds.value = newThresholds
  }

  return {
    thresholds,
    setThresholds,
  }
}
