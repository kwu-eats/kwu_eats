module.exports = {
  root: true,
  extends: ['../../.eslintrc.js', 'next/core-web-vitals'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
};
