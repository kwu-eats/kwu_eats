// web 은 next/core-web-vitals 가 이미 import 플러그인을 등록하므로,
// 모노레포 root config (../../.eslintrc.js) 를 extend 하면 동일 플러그인이
// 두 인스턴스로 잡혀 충돌한다. root 를 extend 하지 않고 필요한 룰만 직접 명시.
module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
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
    'import/no-duplicates': 'error',
  },
};
