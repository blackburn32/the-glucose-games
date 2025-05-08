<template>
  <div class="flex flex-col w-full bg-base-200 rounded-2xl p-[24px] space-y-4">
    <LineGraph
      :data="currentWeekData"
      title="Time in range"
      :low="thresholds.low"
      :high="thresholds.high"
    />
    <UPagination
      v-model:page="currentPage"
      :items-per-page="1"
      :total="totalWeeks"
      variant="soft"
      active-variant="outline"
      :ui="{
        list: 'w-full justify-center',
        item: 'btn btn-sm btn-ghost',
        first: 'btn btn-sm btn-ghost',
        last: 'btn btn-sm btn-ghost',
        prev: 'btn btn-sm btn-ghost',
        next: 'btn btn-sm btn-ghost',
      }"
      class="w-full"
    />
  </div>
</template>

<script setup lang="ts">
import LineGraph from '~/components/global/LineGraph.vue'
import { ONE_WEEK } from '~/types/constants'

const nuxtApp = useNuxtApp()
const glucoseValues = nuxtApp.$glucoseValues
const thresholds = nuxtApp.$thresholds

const weekChunks = computed(() => {
  if (!glucoseValues.value.length) return []
  // Sort by date ascending
  const sorted = [...glucoseValues.value].sort((a, b) => a.created.getTime() - b.created.getTime())
  const chunks = []
  let startIdx = 0
  while (startIdx < sorted.length) {
    const startDate = sorted[startIdx].created
    const endDate = new Date(startDate.getTime() + ONE_WEEK)
    const chunk = []
    let i = startIdx
    while (i < sorted.length && sorted[i].created < endDate) {
      chunk.push(sorted[i])
      i++
    }
    chunks.push(chunk)
    startIdx = i
  }
  return chunks
})

const totalWeeks = computed(() => weekChunks.value.length)
const currentPage = ref(totalWeeks.value)

watch(totalWeeks, (newTotal) => {
  // If data changes, keep on the last (most recent) week
  currentPage.value = newTotal
})

const currentWeekData = computed(() => {
  if (!weekChunks.value.length) return []
  // UPagination is 1-based
  return weekChunks.value[currentPage.value - 1] || []
})
</script>
