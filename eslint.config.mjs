import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Dynamically import the plugin
import tanstackQueryPlugin from '@tanstack/eslint-plugin-query';

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Include the TanStack Query recommended flat config
  ...tanstackQueryPlugin.configs['flat/recommended'],
  // Include other configs
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript', 'prettier'],
    plugins: ['prettier'],
    rules: {
      'prettier/prettier': 'error',
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@/constants',
              importNames: ['*'],
              message: 'Avoid importing * from constants, use named imports instead.',
            },
          ],
        },
      ],
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off',
    },
  }),
];

export default eslintConfig;
