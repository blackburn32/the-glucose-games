<template>
  <DashboardPanelWithHeader
    id="current"
    title="Current Games"
  >
    <div v-if="!hasGlucoseData && !isGlucoseDataLoading">
      <NuxtLink
        class="btn btn-soft"
        to="/account"
      >
        Get Connected to Play
      </NuxtLink>
    </div>
    <div
      v-if="!hasGlucoseData && isGlucoseDataLoading"
      class="flex flex-col w-full items-center space-y-4 px-2"
    >
      <div class="text-4xl font-bold mt-10">
        Loading...
      </div>
    </div>
    <GameViewer
      v-if="hasGlucoseData"
    />
  </DashboardPanelWithHeader>
</template>

<script setup lang="ts">
const nuxtApp = useNuxtApp()
const hasGlucoseData = nuxtApp.$hasGlucoseData
const isGlucoseDataLoading = nuxtApp.isGlucoseDataLoading
</script>
