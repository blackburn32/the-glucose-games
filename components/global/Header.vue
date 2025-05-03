<template>
  <UHeader
    :toggle="false"
    :ui="{
      container: '2xl:px-0',
    }"
  >
    <template #title>
      <NuxtLink to="/">
        <NuxtImg
          src="/favicon.svg"
          alt="Glucose Games Logo"
          width="32"
          height="32"
        />
      </NuxtLink>
    </template>
    <template #right>
      <div class="flex flex-row space-x-4">
        <NuxtLink
          to="/about/general"
          class="btn btn-sm"
        >
          About
        </NuxtLink>
        <NuxtLink
          v-if="!user"
          to="/login"
          class="btn btn-sm btn-primary"
        >
          Sign up
        </NuxtLink>
        <NuxtLink
          v-if="user"
          to="/current"
          class="btn btn-sm btn-primary"
        >
          Dashboard
        </NuxtLink>
      </div>
    </template>
  </UHeader>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
</script>
