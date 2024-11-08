import comments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import jest from 'eslint-plugin-jest';
import jestDom from 'eslint-plugin-jest-dom';
import js from '@eslint/js';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactPlugin from 'eslint-plugin-react';
import testingLibrary from 'eslint-plugin-testing-library';

export default [
  {
    ignores: ['node_modules', 'dist', 'es', 'cjs', 'coverage', '.gh-pages'],
  },
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  {
    plugins: {
      'react-hooks': reactHooksPlugin,
    },
    rules: reactHooksPlugin.configs.recommended.rules,
  },
  comments.recommended,
  eslintConfigPrettier,
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
  {
    files: [
      '**/*.test.{js,jsx}',
      'src/spec_helpers/*.js',
      'src/__*__.{js,jsx}',
    ],

    plugins: { jest, 'jest-dom': jestDom, 'testing-library': testingLibrary },

    languageOptions: {
      globals: {
        ...globals.jest,
        require: false,
      },
    },

    rules: {
      ...jest.configs['flat/recommended'].rules,
      ...jestDom.configs['flat/recommended'].rules,
      ...testingLibrary.configs['flat/react'].rules,
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
