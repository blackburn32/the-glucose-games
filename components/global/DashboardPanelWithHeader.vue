<template>
  <UDashboardPanel
    :id="id"
    :ui="{
      body: 'md:p-0',
    }"
  >
    <template #header>
      <UDashboardNavbar>
        <template #left>
          <UDashboardSearchButton
            class="bg-transparent ring-(--ui-border) min-w-[200px]"
          />
        </template>
        <template
          #right
        >
          <NuxtLink
            v-if="user"
            to="/account"
          >
            <Icon
              name="ph-user-circle"
              size="32"
            />
          </NuxtLink>
          <NuxtLink
            v-if="!user"
            class="btn btn-sm"
            to="/about/general"
          >
            About
          </NuxtLink>
          <NuxtLink
            v-if="!user"
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
