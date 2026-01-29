import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import stylisticPlugin from '@stylistic/eslint-plugin'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import { defineConfig } from 'eslint/config'
import importPlugin from 'eslint-plugin-import'
import globals from 'globals'
import vueParser from 'vue-eslint-parser'
import customPlugin from './eslint/eslint.custom.js'

const eslintrc = new FlatCompat()

export default defineConfig([
  {
    ignores: [
      'public/**/*.*',
      'node_modules/**/*.*',
      'three.js/**/*.*',
      'vite.config.ts',
      'dist/**/*.*',
    ], 
  },

  ...eslintrc.extends('plugin:vue/recommended'),

  {
    files: ['**/*.vue', '**/*.{js,ts}'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        globals: globals.browser,
        extraFileExtensions: ['.vue'],
        project: ['eslint/tsconfig.eslint.json'],
      },
    },
    ...js.configs.recommended,
    plugins: {
      '@stylistic': stylisticPlugin,
      '@typescript-eslint': tsPlugin,
      'import': importPlugin,
      'custom': customPlugin,
    },
    rules: {
      ...tsPlugin.configs['stylistic-type-checked'].rules,
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/method-signature-style': 'warn',
      '@typescript-eslint/no-base-to-string': 'warn',
      '@typescript-eslint/no-dynamic-delete': 'warn',
      '@typescript-eslint/no-implied-eval': 'warn',
      '@typescript-eslint/no-namespace': 'warn',
      '@typescript-eslint/prefer-includes': 'warn',
      '@typescript-eslint/prefer-readonly': 'warn',
      '@typescript-eslint/promise-function-async': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-inferrable-types': 'warn',
      '@typescript-eslint/no-empty-function': 'warn',
      'no-console': 'warn',
      'no-empty': 'warn',
      'arrow-body-style': ['warn', 'as-needed'],
      '@typescript-eslint/consistent-type-assertions': [
        'warn', {
          assertionStyle: 'as',
          objectLiteralTypeAssertions: 'never',
        },
      ],
      '@typescript-eslint/consistent-type-exports': ['warn', { fixMixedExportsWithInlineTypeSpecifier: true }],
      '@typescript-eslint/consistent-type-imports': [
        'warn', {
          prefer: 'type-imports',
          disallowTypeAnnotations: true,
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/naming-convention': [
        'warn', {
          selector: 'variableLike',
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        },
      ],

      '@stylistic/quotes': ['warn', 'single'],
      '@stylistic/indent': ['warn', 2],
      '@stylistic/semi': ['warn', 'never'],
      '@stylistic/comma-dangle': ['warn', 'always-multiline'],
      '@stylistic/eol-last': ['warn', 'always'],
      '@stylistic/no-multiple-empty-lines': [
        'warn', {
          max: 2,
          maxBOF: 0,
          maxEOF: 0, 
        },
      ],
      '@stylistic/comma-spacing': ['warn', { after: true }],
      '@stylistic/quote-props': ['warn', 'consistent'],
      '@stylistic/rest-spread-spacing': ['warn', 'never'],
      '@stylistic/array-bracket-spacing': ['warn', 'never'],
      '@stylistic/array-bracket-newline': ['warn', { multiline: true }],
      '@stylistic/array-element-newline': ['warn', 'consistent'],
      '@stylistic/object-curly-spacing': ['warn', 'always'],
      '@stylistic/object-curly-newline': ['warn', { multiline: true }],
      '@stylistic/object-property-newline': ['warn', { allowAllPropertiesOnSameLine: false }],
      '@stylistic/key-spacing': 'warn',
      '@stylistic/type-annotation-spacing': 'warn',
      '@stylistic/switch-colon-spacing': 'warn',
      '@stylistic/implicit-arrow-linebreak': ['warn', 'beside'],
      '@stylistic/arrow-spacing': 'warn',
      '@stylistic/brace-style': ['warn', 'stroustrup'],
      '@stylistic/function-paren-newline': ['warn', 'multiline-arguments'],
      '@stylistic/space-in-parens': ['warn', 'never'],
      '@stylistic/function-call-spacing': ['warn', 'never'],
      '@stylistic/space-unary-ops': 'warn',
      '@stylistic/member-delimiter-style': [
        'warn', {
          multiline: { delimiter: 'none' },
          singleline: {
            delimiter: 'comma',
            requireLast: true, 
          },
        },
      ],
      
      'import/first': 'error',
      'import/no-duplicates': 'error',
      'import/newline-after-import': ['warn', { count: 1 }],
      'import/order': [
        'warn', {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'type', 'index', 'object'],
          alphabetize: {
            order: 'asc',
            orderImportKind: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      'custom/function-multiline-arguments': 'warn',
      
      'vue/max-attributes-per-line': [
        'warn', {
          singleline: 1,
          multiline: { max: 1 },
        },
      ],
      'vue/singleline-html-element-content-newline': ['warn', { ignores: [] }],
      'vue/multiline-html-element-content-newline': ['warn', { ignores: [] }],
      'vue/first-attribute-linebreak': [
        'warn', {
          singleline: 'beside',
          multiline: 'below',
        },
      ],
      'vue/block-tag-newline': ['warn', { maxEmptyLines: 0 }],
      'vue/padding-line-between-blocks': 'warn',
      'vue/padding-line-between-tags': 'warn',
    },
  },
])
