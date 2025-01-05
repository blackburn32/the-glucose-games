<template>
  <div class="flex flex-col w-full items-center space-y-8">
    <div class="text-4xl font-bold mt-10">
      The Glucose Games
    </div>
    <div
      class="flex  flex-col max-w-md w-full space-y-4 p-2 bg-base-200 shadow-md rounded-lg select-none"
    >
      <div class="flex flex-col w-full h-full px-2 pb-2">
        <div class="text-4xl font-bold text-center">
          Login
        </div>
        <div
          v-if="!user"
          class="flex flex-col space-y-4"
        >
          <div class="text-xl font-semibold">
            Email
          </div>
          <input
            id="email"
            ref="email"
            type="email"
            class="input bg-base-300"
          >
          <UButton
            :loading="sendingOtp"
            :disabled="otpSent"
            icon="i-heroicons-envelope"
            size="md"
            color="purple"
            @click="getOneTimePasscode"
          >
            {{ buttonLabel }}
          </UButton>
          <UButton
            icon="i-ph-google-logo-bold"
            size="md"
            color="blue"
            @click="
              supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: authCallbackUrl },
              })
            "
          >
            Sign in with Google
          </UButton>
        </div>
        <div
          v-else
          class="flex flex-col space-y-4"
        >
          <div class="text-xl font-semibold">
            Logged in as {{ user.email }}
          </div>
          <UButton
            block
            icon="i-heroicons-user"
            size="md"
            color="red"
            @click="supabase.auth.signOut()"
          >
            Sign out
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const email = ref<HTMLInputElement | null>(null)
const supabase = useSupabaseClient()
const toast = useToast()
const otpSent = ref(false)
const sendingOtp = ref(false)
const user = useSupabaseUser()
const authCallbackUrl = useRuntimeConfig().public.authCallbackUrl as string

const cookieName = useRuntimeConfig().public.supabase.cookieName
const redirectCookie = useCookie(`${cookieName}-redirect-path`)
const route = useRoute()
const redirectParam = route.query.redirect as string | undefined
if (redirectParam) {
  const noDomain = redirectParam.startsWith('/')
  if (noDomain) {
    redirectCookie.value = redirectParam
  }
}

const buttonLabel = computed(() => {
  if (otpSent.value) {
    return 'One time link sent'
  }
  if (sendingOtp.value) {
    return 'Sending...'
  }
  return 'Get one time login link'
})

const getOneTimePasscode = async () => {
  const emailValue = email.value?.value
  if (!emailValue) {
    toast.add({ title: 'Please enter an email address', color: 'red' })
    return
  }

  sendingOtp.value = true
  const { error } = await supabase.auth.signInWithOtp({
    email: emailValue,
    options: {
      emailRedirectTo: authCallbackUrl,
    },
  })

  sendingOtp.value = false
  otpSent.value = true

  if (error) {
    toast.add({ title: error.message, color: 'red' })
    return
  }
  else {
    toast.add({ title: 'Check your email!' })
  }
}
</script>
