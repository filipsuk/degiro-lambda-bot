module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint', 'import', 'jest'],
  extends: [
    'airbnb-typescript/base',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  rules: {
    'no-console': 'off',
    'consistent-return': 'off',
    'import/prefer-default-export': 'off',
    'no-empty-function': ['error', { allow: ['constructors'] }],
    'no-useless-constructor': 'off',
    'no-restricted-syntax': ['error', 'LabeledStatement', 'WithStatement'],
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/consistent-type-assertions': [
      'error',
      {
        assertionStyle: 'as',
        objectLiteralTypeAssertions: 'allow-as-parameter',
      },
    ],
    'import/order': ['error', { 'newlines-between': 'always' }],
    'no-await-in-loop': 'off',
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      {
        allowExpressions: true,
        allowHigherOrderFunctions: true,
        allowTypedFunctionExpressions: true,
      },
    ],
    'import/no-extraneous-dependencies': 'off',
  },
  overrides: [
    {
      files: ['**/*.test.{js,ts}', '**/*.spec.{js,ts}', '**/*.e2e.{js,ts}'],
      rules: {
        '@typescript-eslint/consistent-type-assertions': 'off',
      },
    },
  ],
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true, // always try to resolve types under `<roo/>@types` directory even it doesn't contain any source code, like `@types/unist`
      },
    },
  },
  env: {
    node: true,
    'jest/globals': true,
  },
};
