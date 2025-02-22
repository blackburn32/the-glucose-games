<template>
  <div>
    <button
      v-if="!authenticated"
      ref="trigger"
      class="ml-2 flex items-center py-2 px-4 space-x-2"
      @click="maybeTriggerSignIn"
    >
      <Icon
        name="ph:user-bold"
        size="16"
      />
      <span class="truncate ml-2 text-sm font-medium hover:brightness-125">
        {{ label }}
      </span>
    </button>
  </div>
  <Dropdown
    v-if="authenticated"
    align="right"
  >
    <div class="flex items-center py-2 px-4 space-x-2">
      <Icon
        name="ph:user-bold"
        size="16"
      />
      <span class="truncate text-sm font-medium hover:brightness-125">
        {{ label }}
      </span>
      <Icon
        name="ph:caret-down"
        size="16"
      />
    </div>
    <template #dropdown>
      <ul v-if="authenticated">
        <li class="">
          <NuxtLink
            class="font-medium text-sm hover:brightness-125 flex items-center py-1 px-3 space-x-4"
            to="/account"
          >
            <Icon
              name="ph:gear"
              size="16"
            />
            <span> Settings </span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            class="font-medium text-sm hover:brightness-125 flex items-center py-1 px-3 space-x-4"
            to="/connect"
          >
            <Icon
              :name="hasGlucoseData ? 'ph:plugs-connected' : 'ph:plugs'"
              size="16"
            />
            <span> Connections </span>
          </NuxtLink>
        </li>
        <li>
          <button
            class="font-medium text-sm hover:brightness-125 flex flex-row items-center py-1 px-3 space-x-4"
            @click="triggerSignOut"
          >
            <Icon
              name="ph:door"
              size="16"
              class="text-center"
            />
            <span> Sign Out </span>
          </button>
        </li>
      </ul>
    </template>
  </Dropdown>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
const authenticated = computed(() => {
  return !!user.value
})
const supabase = useSupabaseClient()
const { hasGlucoseData } = useGlucoseValues()

const label = computed(() => {
  return authenticated.value ? 'Account' : 'Sign In'
})

const triggerSignOut = () => {
  supabase.auth.signOut()
  navigateTo('/')
}

const maybeTriggerSignIn = () => {
  navigateTo('/login')
}
</script>
