<template>
  <div class="flex flex-col w-full">
    <ClientOnly>
      <div
        v-if="isReady"
        class="flex flex-col w-full pl-8"
      >
        <div class="text-2xl font-semibold leading-tight max-w-full">
          {{ title }}
        </div>
        <div class="flex flex-row justify-between">
          <div v-if="duration">
            {{ duration }}
          </div>
          <div
            v-if="best"
            class="text-end mr-10"
          >
            Best: {{ best }}
          </div>
        </div>
      </div>
      <div
        v-if="data.length == 0"
        class="skeleton flex items-center justify-center min-h-[292px] w-full"
      >
        <div class="text-2xl">
          No data available
        </div>
      </div>
      <VisXYContainer
        v-if="data.length > 0 && isReady"
        :data="data"
        :y-domain="[0, useMmol ? 23 : 400]"
      >
        <VisLine
          v-if="low"
          :x="x"
          :y="() => low"
          color="red"
        />
        <VisLine
          v-if="high"
          :x="x"
          :y="() => high"
          color="var(--color-warning)"
        />
        <VisLine
          :x="x"
          :y="y"
          :line-width="2.5"
          color="var(--color-accent)"
        />
        <VisArea
          :x="x"
          :y="y"
          color="var(--color-accent)"
          :opacity="0.1"
        />

        <VisAxis
          type="x"
          :x="x"
          :tick-format="tickFormat"
        />
        <VisAxis
          :y="y"
          type="y"
        />
        <VisTooltip />
        <VisCrosshair
          :x="x"
          :y="y"
          :template="crosshairTemplate"
          color="var(--color-primary)"
        />
      </VisXYContainer>
      <div v-if="!isReady">
        <div class="flex flex-col w-full ml-8">
          <div class="text-2xl font-semibold leading-tight max-w-full">
            {{ title }}
          </div>
          <div class="flex flex-row justify-between">
            <div v-if="duration">
              Loading...
            </div>
            <div
              v-if="best"
              class="text-end mr-10"
            >
              Best: Loading...
            </div>
          </div>
        </div>
        <div class="skeleton min-h-[292px] w-full" />
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { VisAxis, VisXYContainer, VisLine, VisArea, VisCrosshair, VisTooltip } from '@unovis/vue'
import type { GlucoseRecord } from '~/types/glucoseRecord'

const isReady = ref(false)

defineProps<{
  data: GlucoseRecord[]
  title: string
  duration?: string | undefined
  low?: number | undefined
  high?: number | undefined
  best?: string | undefined
}>()
const x = (d: GlucoseRecord) => d.created
const y = (d: GlucoseRecord) => d.value

const { useMmol, unit } = useDisplaySettings()

const getCleanDate = (d: Date) => {
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })
}

const tickFormat = (d: number) => getCleanDate(new Date(d))
const crosshairTemplate = (d: GlucoseRecord) => {
  return `${getCleanDate(d.created)}: ${d.value.toFixed(2)} ${unit.value}`
}

// Delay rendering until after page transition to make things snappier
onMounted(() => {
  // Use nextTick to ensure DOM is updated
  nextTick(() => {
    // Add a small delay to ensure transition is complete
    setTimeout(() => {
      isReady.value = true
    }, 10)
  })
})
</script>

<style scoped>
.unovis-xy-container {
    --vis-tooltip-background-color: oklch(0.243535 0 0);
    --vis-tooltip-text-color: #fff;
    --vis-axis-grid-line-width: 0.5px;
    --vis-axis-grid-color: #fff;
}
</style>
