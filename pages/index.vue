<template>
  <div class="flex flex-col w-full items-center">
    <div class="text-4xl font-bold mt-10">
      The Glucose Games
    </div>
    <NuxtImg
      class="w-full md:max-w-xl"
      src="https://robpsmulkkgavocpifbg.supabase.co/storage/v1/object/public/images/glucoseGamesLogoLarge2.png?t=2025-01-20T18%3A33%3A22.087Z"
      height="2856"
      width="2869"
    />
    <div class="flex flex-row space-x-4 mb-10 mt-4">
      <NuxtLink
        v-if="!hasDexcom"
        class="btn btn-outline"
        to="/connect"
      >
        Get connected
      </NuxtLink>
      <NuxtLink
        v-if="hasDexcom"
        class="btn btn-outline"
        to="/current"
      >
        Current Games
      </NuxtLink>
      <NuxtLink
        v-if="hasDexcom"
        class="btn btn-outline"
        to="/history"
      >
        History
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const { hasDexcom } = useTokenStatus()
const user = useSupabaseUser()
</script>
