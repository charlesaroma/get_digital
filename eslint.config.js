import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

const ui = ['src/pages/**', 'src/components/**', 'src/AdminDashboard/**']

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    // UI asks query hooks; it never touches services, the transport or src/data.
    files: ui.map((p) => `${p}/*.{js,jsx}`).concat(ui.map((p) => `${p}/**/*.{js,jsx}`)),
    rules: {
      'no-restricted-imports': ['error', { patterns: [
        { group: ['@/store/tanstackStore/services/**', '**/services/**'], message: 'UI uses query hooks, not services.' },
        { group: ['@/data/**', '**/data/*.json'], message: 'UI never imports src/data; go through a query hook.' },
      ] }],
    },
  },
  {
    // The admin is its own app: site pages and shared components never import it.
    files: ['src/pages/**/*.{js,jsx}', 'src/components/**/*.{js,jsx}'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [
        { group: ['@/AdminDashboard/**'], message: 'Site code must not import the admin dashboard.' },
        { group: ['@/store/tanstackStore/services/**', '**/services/**'], message: 'UI uses query hooks, not services.' },
        { group: ['@/data/**', '**/data/*.json'], message: 'UI never imports src/data.' },
      ] }],
    },
  },
  {
    // ...and the admin never imports site pages.
    files: ['src/AdminDashboard/**/*.{js,jsx}'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [
        { group: ['@/pages/**'], message: 'The admin must not import site pages.' },
        { group: ['@/store/tanstackStore/services/**', '**/services/**'], message: 'UI uses query hooks, not services.' },
        { group: ['@/data/**', '**/data/*.json'], message: 'UI never imports src/data.' },
      ] }],
    },
  },
])
