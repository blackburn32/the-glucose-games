<template>
  <div class="flex flex-col w-full items-center space-y-4 px-2">
    <div class="text-4xl font-bold mt-10">
      Achievements
    </div>
    <div class="flex flex-row w-full items-end justify-center space-x-4">
      <NuxtLink
        class="btn btn-outline"
        to="/current"
      >
        Current Games
      </NuxtLink>
      <NuxtLink
        class="btn btn-outline"
        to="/history"
      >
        Gaming Records
      </NuxtLink>
      <NuxtLink
        class="btn btn-outline space-x-2"
        to="/account"
      >
        <Icon
          name="ph:gear"
          :size="24"
          class="cursor-pointer hover:scale-105"
        />
        <div class="text-sm">
          Account
        </div>
      </NuxtLink>
    </div>
    <AchievementsViewer />
  </div>
</template>

<script setup lang="ts">
</script>
