import { fixupConfigRules } from '@eslint/compat';
import globals from 'globals';
import jest from 'eslint-plugin-jest';
import jestDom from 'eslint-plugin-jest-dom';
import testingLibrary from 'eslint-plugin-testing-library';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ['node_modules', 'dist', 'es', 'cjs', 'coverage', '.gh-pages'],
  },
  ...fixupConfigRules(
    compat.extends(
      'eslint:recommended',
      'plugin:import/recommended',
      'plugin:react/recommended',
      'plugin:react/jsx-runtime',
      'plugin:react-hooks/recommended',
      'plugin:@eslint-community/eslint-comments/recommended',
      'prettier',
    ),
  ),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },

      ecmaVersion: 'latest',
      sourceType: 'module',
    },

    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.json'],
        },
      },

      react: {
        version: 'detect',
      },
    },

    rules: {
      '@eslint-community/eslint-comments/no-unused-disable': 'error',

      '@eslint-community/eslint-comments/disable-enable-pair': [
        'error',
        {
          allowWholeFile: true,
        },
      ],

      'import/extensions': [
        'error',
        'never',
        {
          json: 'always',
        },
      ],

      'import/prefer-default-export': 'off',
      'import/no-default-export': 'error',
      'import/no-named-as-default': 'off',

      'no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          varsIgnorePattern: '^_\\d*$',
          argsIgnorePattern: '^_\\d*$',
        },
      ],

      'react/jsx-no-useless-fragment': 'error',
    },
  },
  ...compat
    .extends(
      'plugin:jest/recommended',
      'plugin:testing-library/react',
      'plugin:jest-dom/recommended',
    )
    .map((config) => ({
      ...config,
      files: ['**/*.test.{js,jsx}', 'src/__*.js', 'src/spec_helpers/*.js'],
    })),
  {
    files: ['**/*.test.{js,jsx}', 'src/__*.js', 'src/spec_helpers/*.js'],

    plugins: {
      jest,
      'jest-dom': jestDom,
      'testing-library': testingLibrary,
    },

    languageOptions: {
      globals: {
        ...globals.jest,
        require: false,
      },
    },

    rules: {
      'import/no-extraneous-dependencies': 'off',
      'react/display-name': 'off',
      'react/jsx-no-bind': 'off',
      'react/prop-types': 'off',
      'jest/expect-expect': 'off',
      'jest/no-standalone-expect': 'off',
      'testing-library/no-node-access': 'off',
    },
  },
  {
    files: ['examples/**/*'],

    rules: {
      'import/no-extraneous-dependencies': 'off',
      'react/prop-types': 'off',
    },
  },
  {
    files: ['jest.config.js', 'pug.config.js'],

    languageOptions: {
      globals: {
        ...globals.node,
      },

      sourceType: 'commonjs',
    },
  },
  {
    files: ['eslint.config.mjs'],

    rules: {
      'import/no-default-export': 'off',
    },
  },
];
