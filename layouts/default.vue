<template>
  <div class="flex overflow-hidden h-[100vh] w-screen">
    <div class="relative flex flex-1 flex-col h-full max-w-full">
      <Header />
      <div class="flex flex-1 flex-col h-full max-w-full overflow-y-auto">
        <slot />
        <Footer />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
