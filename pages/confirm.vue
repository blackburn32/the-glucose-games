<template>
  <div class="flex flex-col w-full h-full justify-center items-center min-h-[calc(100vh-248px)] space-y-4">
    <div class="text-4xl">
      Welcome to The Glucose Games!
    </div>
    <div class="flex flex-row space-x-4">
      <NuxtLink
        v-if="!hasGlucoseData"
        class="btn btn-soft"
        to="/connect"
      >
        Get connected
      </NuxtLink>
      <NuxtLink
        v-if="hasGlucoseData"
        class="btn btn-soft"
        to="/current"
      >
        Current Games
      </NuxtLink>
      <NuxtLink
        v-if="hasGlucoseData"
        class="btn btn-soft"
        to="/history"
      >
        History
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const cookieName = useRuntimeConfig().public.supabase.cookieName
const redirectCookie = useCookie(`${cookieName}-redirect-path`)

if (redirectCookie.value) {
  const redirectPath = redirectCookie.value
  redirectCookie.value = null
  await navigateTo(redirectPath)
}

const nuxtApp = useNuxtApp()
const hasGlucoseData = nuxtApp.$hasGlucoseData
const refreshData = nuxtApp.$refreshData

await refreshData()
</script>
