export const cleanPercentForDisplay = (percentTimeInRange: number) => {
  if (!percentTimeInRange) return '0.00'
  return percentTimeInRange.toFixed(2)
}
