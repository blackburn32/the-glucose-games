<template>
  <div class="flex flex-col w-full h-full justify-center items-center min-h-[calc(100vh-248px)]">
    <div class="text-4xl">
      Welcome to The Glucose Games!
    </div>
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser()

const cookieName = useRuntimeConfig().public.supabase.cookieName
const redirectPath = useCookie(`${cookieName}-redirect-path`).value

useAsyncData(async () => {
  if (user.value) {
    // Clear cookie
    useCookie(`${cookieName}-redirect-path`).value = null
    // Redirect to path
    return navigateTo(redirectPath || '/home')
  }
  return false
})
</script>
