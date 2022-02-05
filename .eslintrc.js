module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'jest',
  ],
  rules: {
    "@typescript-eslint/no-unused-vars":'warn',
    "react/jsx-filename-extension": "off",
    "max-classes-per-file": "off",
    "@typescript-eslint/return-await": "off",
    "@typescript-eslint/semi": ['error', 'never'],
    semi: ['error', 'never'],
    'import/prefer-default-export': 'off',
    'class-methods-use-this': 'off',
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
  },
}
