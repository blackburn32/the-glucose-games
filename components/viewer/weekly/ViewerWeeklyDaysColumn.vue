<template>
  <div class="grid grid-cols-1 gap-2">
    <div
      v-for="dayOfWeek in DaysOfWeek"
      :key="dayOfWeek"
      class="text-xs xl:ml-4 self-center"
    >
      {{ dayOfWeek }}
    </div>
    <div /> <!-- This is to provide a space for the time periods at the bottom of ViewerWeeklyColumn -->
  </div>
</template>

<script setup lang="ts">
import { DaysOfWeek } from '~/types/constants'
</script>
