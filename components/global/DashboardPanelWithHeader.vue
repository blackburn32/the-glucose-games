<template>
  <UDashboardPanel
    :id="id"
  >
    <template #header>
      <UDashboardNavbar>
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template
          v-if="!user"
          #right
        >
          <NuxtLink
            class="btn btn-sm"
            to="/about/general"
          >
            About
          </NuxtLink>
          <NuxtLink
            class="btn btn-sm btn-primary"
            to="/login"
          >
            Sign up
          </NuxtLink>
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <TransitionSlide
        appear
        :offset="[-100, 0]"
      >
        <div v-if="mounted">
          <slot />
        </div>
      </TransitionSlide>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
defineProps<{
  id: string
  title: string
}>()

const user = useSupabaseUser()

const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})
onUnmounted(() => {
  mounted.value = false
})
</script>
