'use strict';

module.exports = function (environment) {
  const ENV = {
    modulePrefix: 'frontend-toezicht-abb',
    environment,
    rootURL: '/',
    locationType: 'history',
    EmberENV: {
      EXTEND_PROTOTYPES: false,
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    moment: {
      allowEmpty: true,
    },
    acmidm: {
      clientId: '{{ACMIDM_CLIENT_ID}}',
      baseUrl: '{{ACMIDM_BASE_URL}}',
      scope: 'openid vo profile ABBDatabankToezicht',
      redirectUrl: '{{ACMIDM_AUTH_REDIRECT_URL}}',
      logoutUrl: '{{ACMIDM_LOGOUT_URL}}',
    },
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  return ENV;
};
