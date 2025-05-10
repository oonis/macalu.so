import js from '@eslint/js';
import react from 'eslint-plugin-react';
import typescript from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    ignores: ['**/*.js', '.next/**'],
  },
  {
    files: ['**/*.jsx', '**/*.tsx', '**/*.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        window: true,
        document: true,
        URL: true,
      },
    },
    plugins: {
      react,
      '@typescript-eslint': typescript,
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
];
