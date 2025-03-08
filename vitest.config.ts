import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    coverage: {
      reporter: ['text', 'json', 'json-summary'],
      reportOnFailure: true,
      enabled: true,
      exclude: [
        '.data/**',
        '.idea/**',
        '.nuxt/**',
        '.output/**',
        '.wrangler/**',
        'cloudflare-pages/**',
        'content/**',
        'coverage/**',
        'dist/**',
        'node_modules/**',
        'public/**',
        'signatures/**',
        'types/**',
        '**/*.d.ts',
        '*.env*',
        '*.config.ts',
        '*.config.js',
        '*.mjs',
        '*.md',
        '*.json',
        '*.toml',
        'LICENSE',
        '.gitignore',
      ],
    },
  },
})
