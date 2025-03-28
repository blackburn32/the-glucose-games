<template>
  <section class="relative border-base-200 w-full">
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div class="py-12 md:py-20">
        <div
          class="max-w-3xl mx-auto text-center pb-[24px]"
        >
          <div class="text-4xl">
            Join the open beta!
          </div>
        </div>

        <div class="text-center not-prose">
          <div class="max-w-xs mx-auto sm:max-w-none sm:inline-flex sm:justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div>
              <NuxtLink
                class="btn btn-primary w-full shadow-sm"
                to="/login"
              >Get started</NuxtLink>
            </div>
            <div>
              <NuxtLink
                class="btn btn-neutral shadow-sm group"
                to="/demo"
              >
                Check out the demo
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>
