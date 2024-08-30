// @ts-check
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['dist/', 'node_modules/'],
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tseslint, 
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': ['warn'],
      '@typescript-eslint/no-explicit-any': 'error'
    },
  },
];
