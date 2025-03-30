<template>
  <div
    class="flex flex-row items-center w-full md:max-w-lg bg-base-200 px-4 py-2 rounded space-x-4"
  >
    <Icon
      :name="icon"
      size="32"
      class="shrink-0"
      :class="{
        'text-primary': completedDate,
      }"
    />
    <div class="flex flex-col">
      <div class="font-bold">
        {{ name }}
      </div>
      <div class="text-xs">
        {{ description }}
      </div>
    </div>
    <div class="flex flex-col items-end grow pt-1">
      <div class="flex flex-col items-end w-full max-w-32 min-w-32 space-y-2">
        <ClientOnly>
          <div
            v-if="completedDate"
            class="flex flex-row w-full items-center justify-between px-1"
          >
            <div class="text-xs">
              Completed:
            </div>
            <div
              class="text-xs"
            >
              {{ completedDate }}
            </div>
          </div>
        </ClientOnly>
        <fieldset
          v-if="goal"
          class="fieldset w-full grow"
        >
          <progress
            class="progress progress-primary w-full"
            :value="progress"
            :max="goal"
          />
          <div class="label pt-1">
            <span class="fieldset-label text-xs">Progress:</span>
            <span class="fieldset-label-alt text-xs">{{ currentProgress }}/{{ goal }}</span>
          </div>
        </fieldset>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string
  description: string
  icon: string
  completedDate?: string | undefined
  progress?: number | undefined
  goal?: number | undefined
}>()

const currentProgress = computed(() => {
  const current = props.progress ?? 0
  return Math.min(current, props.goal ?? 1)
})
</script>
