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
      <slot />
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
defineProps<{
  id: string
  title: string
}>()

const user = useSupabaseUser()
</script>
