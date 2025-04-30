<template>
  <StatBadge
    v-if="mostRecentResult"
    title="Current blood glucose"
    :value="`${mostRecentResult.value.toString()} ${unit}`"
    :description="timeSinceMostRecentResult"
    :icon="mostRecentResultIsInRange ? 'ph:check-circle' : undefined"
    icon-color="text-accent"
  />
</template>

<script setup lang="ts">
import prettyMilliseconds from 'pretty-ms'
import { useInterval } from '@vueuse/shared'
import { useGlucoseValues } from '~/composables/useGlucoseValues'

const { mostRecentResult } = useGlucoseValues()
const { unit } = useDisplaySettings()
const { thresholds } = useThresholds()

const mostRecentResultIsInRange = computed(() => {
  if (!mostRecentResult.value) return false
  return mostRecentResult.value.value > thresholds.value.low && mostRecentResult.value.value < thresholds.value.high
})

const calculateTimeSinceMostRecentResult = () => {
  if (!mostRecentResult.value) return ''
  const now = new Date()
  const ms = now.getTime() - mostRecentResult.value.created.getTime()
  return `${prettyMilliseconds(ms, { secondsDecimalDigits: 0 })} ago`
}

const timeSinceMostRecentResult = ref(calculateTimeSinceMostRecentResult())
useInterval(1000, {
  callback: () => timeSinceMostRecentResult.value = calculateTimeSinceMostRecentResult(),
})
</script>
