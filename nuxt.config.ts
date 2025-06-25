import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: [
    '@morev/vue-transitions/nuxt',
    '@nuxt/test-utils/module',
    '@nuxtjs/supabase',
    '@nuxt/ui-pro',
    '@nuxt/eslint',
    '@nuxthub/core',
    '@nuxt/image',
    '@samk-dev/nuxt-vcalendar',
    '@sentry/nuxt/module',
    '@nuxtjs/seo',
    '@nuxt/content',
  ],

  $production: {
    runtimeConfig: {
      public: {
        authCallbackUrl: 'https://glucose.games/dashboard',
        supabase: {
          url: 'https://robpsmulkkgavocpifbg.supabase.co',
          key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvYnBzbXVsa2tnYXZvY3BpZmJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5Nzg5NjYsImV4cCI6MjA1MjU1NDk2Nn0.EMfcKeCxgwVdTqDDt67BNADc82ZMNKLpaJRVK_uo-mA',
        },
      },
      supabase: {
        serviceKey: 'This is overridden by .env',
      },
    },
  },

  ssr: false,

  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  app: {
    head: {
      title: 'The Glucose Games',
      meta: [
        { charset: 'utf-8' },
        { name: 'description', content: 'The games you play with your blood glucose' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: 'https://glucose.games/favicon.png' },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  router: {
    options: {
      scrollBehaviorType: 'smooth',
    },
  },

  site: {
    url: 'https://glucose.games',
    name: 'The Glucose Games',
    description: 'The games you play with your blood glucose',
    image: 'https://glucose.games/favicon.png',
  },

  content: {
    preview: {
      api: 'https://api.nuxt.studio',
    },
  },

  runtimeConfig: {
    public: {
      authCallbackUrl: 'http://localhost:3000/dashboard',
    },
  },

  routeRules: {
    '/**': {
      headers: {
        'Document-Policy': 'js-profiling',
      },
    },
  },

  sourcemap: {
    client: 'hidden',
  },

  compatibilityDate: '2024-11-01',

  nitro: {
    preset: 'cloudflare-pages',
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
    test: {
      coverage: {
        reporter: ['json', 'json-summary'],
        reportOnFailure: true,
      },
    },
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },

  ogImage: {
    enabled: false,
  },

  schemaOrg: {
    identity: {
      '@type': 'Organization',
      'name': 'The Glucose Games',
      'description': 'The games you play with your blood glucose!',
      'url': 'https://glucose.games',
      'logo': 'https://glucose.games/favicon.png',
      'email': 'support@glucose.games',
    },
  },

  sentry: {
    sourceMapsUploadOptions: {
      org: 'the-glucose-games',
      project: 'the-glucose-games',
      authToken: process.env.SENTRY_AUTH_TOKEN,
    },
  },

  supabase: {
    redirectOptions: {
      login: '/signUp',
      callback: '/dashboard',
      exclude: [
        '/about/*',
        '/settings',
        '/dashboard',
        '/records',
        '/achievements',
        '/signUp',
        '/',
      ],
      saveRedirectToCookie: true,
    },
  },
})
