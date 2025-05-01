<template>
  <UDashboardPanel
    :id="id"
  >
    <template #header>
      <UDashboardNavbar>
        <template
          #right
        >
          <USelect
            v-model="durationOfData"
            :items="durationOptions"
            option-label="label"
            option-value="value"
            size="xl"
            class="min-w-[120px]"
          />
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
import { ref } from 'vue'
import { ONE_MONTH, ONE_WEEK, THREE_MONTHS } from '~/types/constants'

const nuxtApp = useNuxtApp()
const durationOfData = nuxtApp.$durationOfData

defineProps<{
  id: string
  title: string
}>()

const user = useSupabaseUser()

const durationOptions = [
  { label: 'Week', value: ONE_WEEK },
  { label: 'Month', value: ONE_MONTH },
  { label: '3 Months', value: THREE_MONTHS },
]

const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})
onUnmounted(() => {
  mounted.value = false
})
</script>
