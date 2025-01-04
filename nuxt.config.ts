// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/supabase', '@nuxt/ui', '@nuxt/eslint'],
  devtools: { enabled: true },
  compatibilityDate: '2024-11-01',

  eslint: {
    config: {
      stylistic: true,
    },
  },

  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: [
        '/about',
        '/confirm',
        '/login',
        '/privacy',
        '/tos',
        '/',
      ],
      cookieRedirect: true,
    },
  },
})
