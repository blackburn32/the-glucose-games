<template>
  <footer class="bg-base-200">
    <div class="max-w-[1440px] mx-auto px-[24px] 2xl:px-0">
      <div class="grid sm:grid-cols-12 gap-8 py-8 md:py-8">
        <div
          class="sm:col-span-6 md:col-span-3 lg:col-span-6 max-sm:order-1 flex flex-col"
        >
          <div class="mb-4">
            <NuxtLink
              class="flex items-center justify-center w-8 h-8"
              to="/"
            >
              <NuxtImg
                class="w-8 h-8"
                src="/favicon.png"
                width="128"
                height="128"
              />
            </NuxtLink>
          </div>
          <div class="grow text-sm">
            The Glucose Games
          </div>
        </div>

        <div class="sm:col-span-6 md:col-span-3 lg:col-span-2">
          <div class="text-sm font-medium mb-2">
            Game
          </div>
          <ul class="text-sm space-y-2">
            <li>
              <NuxtLink
                class="hover:brightness-125 transition"
                to="/dashboard"
                @click="errorIfNotSignedIn"
              >
                Current Games
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                class="hover:brightness-125 transition"
                to="/records"
                @click="errorIfNotSignedIn"
              >
                Gaming Records
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                class="hover:brightness-125 transition"
                to="/achievements"
              >
                Achievements
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div class="sm:col-span-6 md:col-span-3 lg:col-span-2">
          <div class="text-sm font-medium mb-2">
            User
          </div>
          <ul class="text-sm space-y-2">
            <li>
              <NuxtLink
                class="hover:brightness-125 transition"
                to="/signUp"
              >
                Sign In
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                class="hover:brightness-125 transition"
                to="/settings"
                @click="errorIfNotSignedIn"
              >
                Account
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div class="sm:col-span-6 md:col-span-3 lg:col-span-2">
          <div class="text-sm font-medium mb-2">
            Company
          </div>
          <ul class="text-sm space-y-2">
            <li>
              <NuxtLink
                class="hover:brightness-125 transition"
                to="/about/general"
              >
                About
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                class="hover:brightness-125 transition"
                to="/about/terms"
              >
                Terms of Service
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                class="hover:brightness-125 transition"
                to="/about/privacy"
              >
                Privacy policy
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
const toast = useToast()

const errorIfNotSignedIn = () => {
  if (!user.value) {
    toast.add({
      color: 'error',
      title: 'Sign In Required',
      description: 'You must be signed in to access this page.',
    })
  }
}
</script>
