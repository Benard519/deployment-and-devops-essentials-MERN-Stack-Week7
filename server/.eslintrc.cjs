module.exports = {
  env: {
    commonjs: true,
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  ignorePatterns: ['node_modules/', 'dist/'],
  rules: {
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
      },
    ],
  },
};

