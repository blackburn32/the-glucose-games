<template>
  <div class="flex flex-col w-full items-center space-y-4 px-2 mb-10">
    <div class="text-4xl font-bold mt-10">
      Current Games
    </div>
    <div class="flex flex-row w-full items-end justify-center space-x-4">
      <NuxtLink
        class="btn btn-soft"
        to="/history"
      >
        Gaming Records
      </NuxtLink>
      <NuxtLink
        class="btn btn-soft"
        to="/achievements"
      >
        Achievements
      </NuxtLink>
      <NuxtLink
        class="btn btn-soft space-x-2"
        to="/account"
      >
        <Icon
          name="ph:gear"
          :size="24"
          class="cursor-pointer hover:scale-105"
        />
        <div class="text-sm">
          Settings
        </div>
      </NuxtLink>
    </div>
    <div v-if="!hasGlucoseData && !isGlucoseDataLoading">
      <NuxtLink
        class="btn btn-soft"
        to="/connect"
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
  </div>
</template>

<script setup lang="ts">
const nuxtApp = useNuxtApp()
const hasGlucoseData = nuxtApp.$hasGlucoseData
const isGlucoseDataLoading = nuxtApp.isGlucoseDataLoading
</script>
