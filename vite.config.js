import { defineConfig } from 'vite'
import { sentryVitePlugin } from '@sentry/vite-plugin'

export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [// Put the Sentry vite plugin after all other plugins
    sentryVitePlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: 'the-glucose-games',
      project: 'javascript-nuxt',
    }), sentryVitePlugin({
      org: 'the-glucose-games',
      project: 'javascript-nuxt',
    })],
  test: {
    coverage: {
      reporter: ['json', 'json-summary'],
      reportOnFailure: true,
    },
  },
})
