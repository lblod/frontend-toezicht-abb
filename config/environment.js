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
    torii: {
      disableRedirectInitializer: true,
      providers: {
        'acmidm-oauth2': {
          apiKey: '68799bf1-f9eb-4d23-be16-c07c31ae342c',
          baseUrl: 'https://authenticatie-ti.vlaanderen.be/op/v1/auth',
          scope: 'openid vo profile ABBDatabankToezicht',
          redirectUri:
            'https://besluiten.abb.lblod.info/authorization/callback',
          logoutUrl: 'https://authenticatie-ti.vlaanderen.be/op/v1/logout',
        },
      },
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

  if (process.env.DEPLOY_ENV === 'production') {
    ENV['torii']['providers']['acmidm-oauth2']['apiKey'] =
      '581c5176-1a08-48d6-a9ef-e6fb95fe6010';
    ENV['torii']['providers']['acmidm-oauth2']['baseUrl'] =
      'https://authenticatie.vlaanderen.be/op/v1/auth';
    ENV['torii']['providers']['acmidm-oauth2']['redirectUri'] =
      'https://besluiten.abb.vlaanderen.be/authorization/callback';
    ENV['torii']['providers']['acmidm-oauth2']['logoutUrl'] =
      'https://authenticatie.vlaanderen.be/op/v1/logout';
  }

  return ENV;
};
