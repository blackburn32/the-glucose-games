<template>
  <ClientOnly>
    <VisXYContainer
      :data="data"
      :y-domain="[0, 300]"
    >
      <VisLine
        :x="x"
        :y="y"
      />
      <VisScatter
        :x="x"
        :y="y"
        :color="color"
      />
      <VisAxis
        type="x"
        :tick-format="tickFormat"
      />
      <VisAxis
        type="y"
      />
    </VisXYContainer>
  </ClientOnly>
</template>

<script setup lang="ts">
import { VisAxis, VisXYContainer, VisLine, VisScatter } from '@unovis/vue'
import type { GlucoseRecord } from '~/types/types'

const props = defineProps<{ data: GlucoseRecord[], low: number, high: number }>()
const x = (d: GlucoseRecord) => new Date(d.created).getTime()
const y = (d: GlucoseRecord) => d.value
const color = (d: GlucoseRecord) => {
  const isLow = d.value < props.low
  const isHigh = d.value > props.high
  if (isLow) return 'red'
  if (isHigh) return 'yellow'
  return 'green'
}
const tickFormat = (d: number) => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })
</script>
