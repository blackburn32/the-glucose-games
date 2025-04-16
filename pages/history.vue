<template>
  <DashboardPanelWithHeader
    id="records"
    title="Records"
  >
    <div v-if="!hasGlucoseData && !isGlucoseDataLoading">
      <NuxtLink
        class="btn btn-soft"
        to="/account"
      >
        Get Connected to Play
      </NuxtLink>
    </div>
    <div v-if="!hasGlucoseData && isGlucoseDataLoading">
      <div class="text-4xl font-bold mt-10">
        Loading...
      </div>
    </div>
    <HistoryViewer v-if="hasGlucoseData" />
  </DashboardPanelWithHeader>
</template>

<script setup lang="ts">
const nuxtApp = useNuxtApp()
const hasGlucoseData = nuxtApp.$hasGlucoseData
const isGlucoseDataLoading = nuxtApp.$isGlucoseDataLoading
</script>
