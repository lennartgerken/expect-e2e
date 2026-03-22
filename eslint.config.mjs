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
        files: ['test-demos/playwright/**'],
        rules: {
            'playwright/expect-expect': [
                'error',
                {
                    assertFunctionNames: [
                        'expect',
                        'expect.soft',
                        'expect.poll',
                        'expectDetailsToBeEditable',
                        'expectStatusToShow'
                    ]
                }
            ],
            '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    ignoreRestSiblings: true
                }
            ]
        }
    },
    globalIgnores([
        '.next/**',
        'out/**',
        'build/**',
        'next-env.d.ts',
        'playwright-report/**',
        'test-results/**'
    ])
])

export default eslintConfig
