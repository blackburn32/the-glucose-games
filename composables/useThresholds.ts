export type Thresholds = {
  high: number
  low: number
}

export const useThresholds = () => {
  const thresholds = useState<Thresholds>('thresholds', () => {
    return {
      high: 180,
      low: 70,
    }
  })

  watch(thresholds, (value) => {
    if (value.high < value.low) {
      thresholds.value.low = value.high
    }
    if (value.low > value.high) {
      thresholds.value.high = value.low
    }
    if (value.high > 180) {
      thresholds.value.high = 180
    }
    if (value.low < 40) {
      thresholds.value.low = 40
    }
  })

  return thresholds
}
