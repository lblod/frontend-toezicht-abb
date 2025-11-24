'use strict';

module.exports = {
  plugins: ['prettier-plugin-ember-template-tag'],
  overrides: [
    {
      files: '*.{js,ts,gjs}',
      options: {
        singleQuote: true,
      },
    },
  ],
};
