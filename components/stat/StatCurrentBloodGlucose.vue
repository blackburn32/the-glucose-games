<template>
  <StatBadge
    v-if="mostRecentResult"
    title="Current blood glucose"
    :value="`${mostRecentResult.value.toString()} ${unit}`"
    :description="timeSinceMostRecentResult.toString()"
    :icon="mostRecentResultIsInRange ? 'ph:check-circle' : undefined"
    icon-color="text-accent"
  />
</template>

<script setup lang="ts">
import prettyMilliseconds from 'pretty-ms'
import { useTimeSince } from '~/composables/useTimeSince'
import { useGlucoseValues } from '~/composables/useGlucoseValues'

const { mostRecentResult } = useGlucoseValues()
const { unit } = useDisplaySettings()
const { thresholds } = useThresholds()

const mostRecentResultIsInRange = computed(() => {
  if (!mostRecentResult.value) return false
  return mostRecentResult.value.value > thresholds.value.low && mostRecentResult.value.value < thresholds.value.high
})

const mostRecentResultDate = computed(() => mostRecentResult.value?.created)
const timeSinceMostRecentResult = useTimeSince(mostRecentResultDate, {
  formatter: ms => ms > 0 ? `${String(prettyMilliseconds(ms, { secondsDecimalDigits: 0 }))} ago` : '',
})
</script>
