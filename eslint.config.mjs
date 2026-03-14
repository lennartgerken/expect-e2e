import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import tseslint from 'typescript-eslint'
import playwright from 'eslint-plugin-playwright'
import eslint from '@eslint/js'

const eslintConfig = defineConfig([
    eslint.configs.recommended,
    {
        extends: [nextVitals, nextTs],
        ignores: ['test-demos/**']
    },
    {
        extends: [tseslint.configs.recommended, tseslint.configs.stylistic],
        files: ['test-demos/**']
    },
    {
        extends: [playwright.configs['flat/recommended']],
        files: ['test-demos/playwright/**']
    },
    globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts'])
])

export default eslintConfig
