<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
    <TodayGroup class="md:col-span-3" />
    <StreaksGroup class="md:col-span-3 border-t border-b border-base-300" />
    <TrendsGroup class="md:col-span-3" />
  </div>
</template>

<script setup lang="ts">
import TodayGroup from './TodayGroup.vue'
import StreaksGroup from './StreaksGroup.vue'
import TrendsGroup from './TrendsGroup.vue'
</script>
