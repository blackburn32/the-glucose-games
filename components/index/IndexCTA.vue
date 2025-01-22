<template>
  <section class="relative border-t border-base-300 w-full">
    <div
      class="absolute top-0 left-0 right-0 bg-gradient-to-b from-base-300 to-transparent opacity-25 h-[25rem] pointer-events-none -z-10"
      aria-hidden="true"
    />

    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div class="py-12 md:py-20">
        <div
          class="max-w-3xl mx-auto text-center pb-12 md:pb-20 prose"
        >
          <h2 class="text-5xl font-bold font-hkgrotesk">
            Join the open beta!
          </h2>
        </div>

        <div class="text-center not-prose">
          <div class="max-w-xs mx-auto sm:max-w-none sm:inline-flex sm:justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div>
              <NuxtLink
                class="btn btn-primary w-full shadow-sm group"
                to="/login"
              >
                Get Started Free <span class="tracking-normal group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">-&gt;</span>
              </NuxtLink>
            </div>
            <div>
              <NuxtLink
                class="btn btn-outline w-full shadow-sm"
                to="/about"
              >Learn More</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>
