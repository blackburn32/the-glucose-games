<template>
  <div class="relative inline-flex">
    <button
      ref="trigger"
      class="rounded-full"
      :class="{ 'brightness-125': dropdownOpen }"
      aria-haspopup="true"
      :aria-expanded="dropdownOpen"
      @click.prevent="dropdownOpen = !dropdownOpen"
    >
      <slot />
    </button>
    <transition
      enter-active-class="transition ease-out duration-200 transform"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-out duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-show="dropdownOpen"
        class="flex flex-row items-center origin-top-right z-10 absolute top-full min-w-44 bg-base-200/80 py-1.5 rounded shadow-lg overflow-hidden mt-1"
        :class="align === 'right' ? 'right-0' : 'left-0'"
      >
        <slot name="dropdown" />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
defineProps({
  align: {
    type: String,
    default: 'left',
  },
})

const dropdownOpen = ref(false)
const trigger: Ref<HTMLButtonElement | null> = ref(null)
const dropdown: Ref<HTMLDivElement | null> = ref(null)

const clickHandler = (mouseEvent: MouseEvent) => {
  if (
    !dropdownOpen.value
    || trigger.value?.contains(mouseEvent.target as Node)
    || dropdown.value?.contains(mouseEvent.target as Node)
  ) {
    return
  }
  dropdownOpen.value = false
}
const keyHandler = (key: KeyboardEvent) => {
  if (!dropdownOpen.value || key.key !== 'Escape') {
    return
  }
  dropdownOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', clickHandler)
  document.addEventListener('keydown', keyHandler)
})

onUnmounted(() => {
  document.removeEventListener('click', clickHandler)
  document.removeEventListener('keydown', keyHandler)
})
</script>
