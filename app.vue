<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
const router = useRouter()
const scrollTo = (hash: string) => {
  const hashWithNoHashSymbol = hash.replace('#', '')
  document.getElementById(hashWithNoHashSymbol)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}
const hash = computed(() => router.currentRoute.value.hash)
watch(router.currentRoute, () => {
  if (hash.value) {
    scrollTo(hash.value)
  }
})
onMounted(() => {
  if (hash.value) {
    scrollTo(hash.value)
  }
})

const cookieName = useRuntimeConfig().public.supabase.cookieName
const redirectCookie = useCookie(`${cookieName}-redirect-path`)
if (redirectCookie.value) {
  const redirectPath = redirectCookie.value
  redirectCookie.value = null
  await navigateTo(redirectPath)
}
</script>
