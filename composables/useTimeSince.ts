import { ref, computed, type Ref } from 'vue'
import { useInterval } from '@vueuse/shared'

export function useTimeSince(dateRef: Ref<Date | undefined | null>, options?: { formatter?: (ms: number) => string }) {
  const msSince = ref(0)
  const calculate = () => {
    if (!dateRef.value) return 0
    return Date.now() - dateRef.value.getTime()
  }
  msSince.value = calculate()
  useInterval(1000, {
    callback: () => {
      msSince.value = calculate()
    },
  })
  if (options?.formatter) {
    return computed(() => options.formatter!(msSince.value))
  }
  return msSince
}
