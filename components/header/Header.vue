<template>
  <header class="sticky top-0 border-b border-neutral z-30">
    <div class="px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <NuxtLink
        class="flex items-center start"
        :to="mainLinkDestination"
      >
        <NuxtImg
          class="w-8 h-8"
          src="/favicon.png"
          width="128"
          height="128"
        />
      </NuxtLink>
      <div
        class="flex items-center justify-end space-x-1 md:space-x-3 h-16 -mb-px"
      >
        <HeaderDemoToggle />
        <HeaderGameDropdown />
        <HeaderHelpDropdown />
        <hr class="w-px h-6 bg-base-content border-none">
        <HeaderAccountDropdown />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
const mainLinkDestination = computed(() => user.value ? '/home' : '/')
</script>
