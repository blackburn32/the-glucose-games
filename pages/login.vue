<template>
  <div class="flex flex-col w-full items-center space-y-8 pb-40 h-full">
    <div class="text-4xl font-bold mt-10">
      The Glucose Games
    </div>
    <div
      class="flex  flex-col max-w-md w-full space-y-4 py-4 px-2 bg-base-200 shadow-md rounded-lg select-none"
    >
      <div class="flex flex-col w-full h-full px-2 pb-2">
        <div class="text-4xl font-bold text-center">
          Login
        </div>
        <div
          v-if="!user"
          class="flex flex-col space-y-4 w-full"
        >
          <div class="flex flex-col w-full">
            <div class="fieldset mt-4">
              <fieldset class="label cursor-pointer">
                <span class="fieldset-label">I accept The Glucose Games'
                  <NuxtLink
                    class="text-primary underline"
                    to="/privacy"
                  >Privacy Policy
                  </NuxtLink>
                </span>
                <input
                  v-model="acceptedPrivacyPolicy"
                  type="checkbox"
                  class="checkbox checkbox-primary"
                >
              </fieldset>
            </div>
            <div class="fieldset w-full">
              <fieldset class="label cursor-pointer">
                <span class="fieldset-label">I accept The Glucose Games'
                  <NuxtLink
                    class="text-primary underline"
                    to="/tos"
                  >Terms of Service
                  </NuxtLink>
                </span>

                <input
                  v-model="acceptedTermsOfService"
                  type="checkbox"
                  class="checkbox checkbox-primary"
                >
              </fieldset>
            </div>
          </div>
          <div class="text-xl font-semibold">
            Email
          </div>
          <input
            id="email"
            ref="email"
            type="email"
            class="input input-bordered focus:outline-0 w-full"
          >
          <button
            class="btn btn-sm btn-primary"
            :class="{
              'btn-disabled': otpSent,
            }"
            :disabled="otpSent"
            @click="getOneTimePasscode"
          >
            <Icon
              name="ph:envelope"
              size="24"
            />
            {{ buttonLabel }}
          </button>
          <button
            class="btn btn-sm btn-secondary"
            @click=" signUpWithGoogle "
          >
            <Icon
              name="ph:google-logo"
              size="24"
            />
            Sign in with Google
          </button>
        </div>
        <div
          v-else
          class="flex flex-col space-y-4 mt-4"
        >
          <div class="text-xl font-semibold">
            Logged in as {{ user.email }}
          </div>
          <button
            size="md"
            class="btn btn-sm btn-soft"
            @click="supabase.auth.signOut()"
          >
            <Icon
              name="ph:user"
              size="24"
            />
            Sign out
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const email = ref<HTMLInputElement | null>(null)
const otpSent = ref(false)
const sendingOtp = ref(false)

const acceptedPrivacyPolicy = ref(false)
const acceptedTermsOfService = ref(false)

const supabase = useSupabaseClient()
const toast = useToast()
const user = useSupabaseUser()
const route = useRoute()

const runtimeConfig = useRuntimeConfig()
const authCallbackUrl = runtimeConfig.public.authCallbackUrl
const cookieName = runtimeConfig.public.supabase.cookieName

const redirectCookie = useCookie(`${cookieName}-redirect-path`)

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
  if (!acceptedPrivacyPolicy.value) {
    toast.add({ title: 'Accept the privacy policy to sign in', color: 'error' })
    return
  }

  if (!acceptedTermsOfService.value) {
    toast.add({ title: 'Accept the terms of service to sign in', color: 'error' })
    return
  }

  const emailValue = email.value?.value
  if (!emailValue) {
    toast.add({ title: 'Please enter an email address', color: 'error' })
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
    toast.add({ title: error.message, color: 'error', ui: { wrapper: 'absolute' } })
    return
  }
  else {
    toast.add({ title: 'Check your email!' })
  }
}

const signUpWithGoogle = async () => {
  if (!acceptedPrivacyPolicy.value) {
    toast.add({ title: 'Accept the privacy policy to sign in', color: 'error' })
    return
  }

  if (!acceptedTermsOfService.value) {
    toast.add({ title: 'Accept the terms of service to sign in', color: 'error' })
    return
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: authCallbackUrl },
  })

  if (error) {
    toast.add({ title: error.message, color: 'error' })
  }
}
</script>
