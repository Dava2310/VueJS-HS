import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      'no-unused-vars': 'off',
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tsParser,
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.test.ts'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: ['src/components/ui/**'],
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  prettierConfig,
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
];
