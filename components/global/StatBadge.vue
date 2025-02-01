<template>
  <div class="stats h-min overflow-hidden">
    <div class="stat">
      <div class="stat-figure text-secondary">
        <ClientOnly>
          <Icon
            v-if="icon"
            :name="icon"
            size="24"
            :class="iconColor"
          />
        </ClientOnly>
      </div>
      <div class="stat-title">
        {{ title }}
      </div>
      <ClientOnly>
        <div class="stat-value">
          {{ value }}
        </div>
        <div class="stat-desc">
          {{ description }}
        </div>
        <template #fallback>
          <div class="stat-value">
            Loading...
          </div>
          <div class="stat-desc">
            Loading...
          </div>
        </template>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  value: string
  description: string
  icon?: string | undefined
  iconColor?: string | undefined
}>()
</script>
