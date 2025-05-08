<template>
  <div class="grid grid-cols-1 gap-2 place-items-center">
    <div
      v-for="dayOfWeek in DaysOfWeek"
      :key="dayOfWeek"
      class="flex flex-col items-center justify-center text-xs xl:ml-4 self-center text-center h-[40px]"
    >
      {{ dayOfWeek.slice(0, isMobile ? 1 : 3) }}
    </div>
    <div class="h-[20px] w-full" /> <!-- This is to provide a space for the time periods at the bottom of ViewerWeeklyColumn -->
  </div>
</template>

<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { DaysOfWeek } from '~/types/constants'

const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smallerOrEqual('sm')
</script>
