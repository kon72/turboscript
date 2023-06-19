/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['next', 'turbo', 'prettier'],
  plugins: ['prettier'],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'prettier/prettier': 'error',
  },
  parserOptions: {
    babelOptions: {
      presets: [require.resolve('next/babel')],
    },
  },
};
