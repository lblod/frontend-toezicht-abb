'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = async function (defaults) {
  const app = new EmberApp(defaults, {});

  const { setConfig } = await import('@warp-drive/build-config');
  setConfig(app, __dirname, {
    deprecations: {
      DEPRECATE_STORE_EXTENDS_EMBER_OBJECT: false,
    },
  });

  return app.toTree();
};
