<template>
  <div class="flex flex-col w-full h-full justify-center items-center">
    <div class="text-4xl">
      Welcome
    </div>
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser()

const cookieName = useRuntimeConfig().public.supabase.cookieName
const redirectPath = useCookie(`${cookieName}-redirect-path`).value

watch(
  user,
  () => {
    if (user.value) {
      // Clear cookie
      useCookie(`${cookieName}-redirect-path`).value = null
      // Redirect to path
      return navigateTo(redirectPath || '/home')
    }
  },
  { immediate: true },
)
</script>
