<template>
  <Dropdown>
    <div class="flex items-center">
      <span class="sr-only">Info</span>
      <Icon
        name="ph:info-bold"
        size="24"
      />
    </div>
    <template #dropdown>
      <ul ref="dropdown">
        <li>
          <NuxtLink
            class="font-medium text-sm hover:brightness-125 flex items-center py-1 px-3 space-x-4"
            to="/about"
          >
            <Icon
              name="ph:info"
              size="16"
            />
            <span>About</span>
          </NuxtLink>
        </li>
      </ul>
    </template>
  </Dropdown>
</template>

<script setup lang="ts">
</script>
