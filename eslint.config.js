import js from '@eslint/js';

export default [
  {
    ignores: ['node_modules', 'dist', 'coverage', 'bun.lockb'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-implicit-coercion': 'error',
      eqeqeq: 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
    },
  },
  {
    files: ['**/*.ts'],
    ignores: ['node_modules', 'dist', 'coverage'],
    languageOptions: {
      parser: undefined, // Use Bun's built-in TS parser
      ecmaVersion: 2024,
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': 'off', // TS handles this
    },
  },
];
