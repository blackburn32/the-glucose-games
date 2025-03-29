<template>
  <div class="flex flex-row w-full h-full items-center">
    <ClientOnly>
      <div class="flex flex-col items-center w-full h-full relative">
        <VisXYContainer
          :data="dataCurrent"
          :y-domain="[useMmol ? 2 : 40, useMmol ? 10 : 200]"
        >
          <VisLine
            :x="x"
            :y="y"
            :line-width="2.5"
            color="var(--color-accent)"
          />
          <VisLine
            :x="x"
            :y="yOld"
            :line-width="2.5"
            color="var(--color-base-content)"
            :line-dash-array="[5]"
          />
          <VisLine
            :x="x"
            :y="() => 70"
            color="var(--color-secondary-content)"
          />
          <VisLine
            :x="x"
            :y="() => 180"
            color="var(--color-secondary-content)"
          />
        </VisXYContainer>
        <div class="absolute top-7 px-2 bg-base-300">
          {{ thresholds.high }}
        </div>
        <div class="absolute bottom-11 px-2 bg-base-300">
          {{ thresholds.low }}
        </div>
      </div>
      <template #fallback>
        <div class="skeleton min-h-[240px] w-full" />
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { VisLine, VisXYContainer } from '@unovis/vue'
import { SmoothButVariableGeneratorConfig } from '~/utils/generators/config/generatorConfig'
import type { GlucoseRecord } from '~/types/glucoseRecord'
import { generateSinusoidalPattern } from '~/utils/generators/sinusoid/sinusoidalGenerator'

const nuxtApp = useNuxtApp()
const thresholds = nuxtApp.$thresholds
const { useMmol } = useDisplaySettings()
const dataCurrent = ref(generateSinusoidalPattern(SmoothButVariableGeneratorConfig, 100, 5, 1.25))
const dataPast = ref(generateSinusoidalPattern(SmoothButVariableGeneratorConfig, 100, 5, 1.5, Math.PI / 4))

const x = (d: GlucoseRecord) => d.x
const y = (d: GlucoseRecord) => d.y
const yOld = (d: GlucoseRecord) => {
  return dataPast.value.find(record => record.x === d.x)?.y
}
</script>
