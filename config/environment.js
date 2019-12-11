'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'frontend-toezicht-abb',
    environment,
    rootURL: '/',
    locationType: 'auto',
    besluitTypeUri: "http://data.lblod.info/DecisionType/5b3955cc006323233e711c482f3a6bf39a8d3eba6bbdb2c672bdfcf2b2985b03", // Reglementen en verordeningen
    regulationTypeUri: "http://data.lblod.info/RegulationType/ef35b053c004a25069c58090d967ade753dd02586b0f76b916a0ca82b7294d0b", // Belastingsreglement
    taxTypeUri: "http://data.lblod.info/TaxType/0a9c8b98da3f166b86cfe827bc0e6b779a4dc2f7a69e7be6031fd1959eaedc0d", // Aanvullende belasting of opcentiem
    marCodes: [  // MAR codes for Vlabel
      "0ce2d45f1bb5414e7cd4d9de7929097e7278260434ded0b16d336bb407e9f0ec",
      "6c8132fc24e1be8b0134380e308eef3adb1357f0fb8bbfa62eea8197916580fd",
      "06d669bb64d3959b0e515751a63a73cd2c4371686f7562111ab2e988141f9ea8"
    ],
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    moment: {
      allowEmpty: true
    },
    'vo-webuniversum': {
      version: '2.8.3',
      header: '//widgets.vlaanderen.be/widget/live/3bb08030ceda4f0a9ce6af70fd4cf1cd',
      footer: '//widgets.vlaanderen.be/widget/live/9b531b3ce5b343b99f4e36eb3600f25f'
    },
    torii: {
      disableRedirectInitializer: true,
      providers: {
        'acmidm-oauth2': {
          apiKey: '68799bf1-f9eb-4d23-be16-c07c31ae342c',
          baseUrl: 'https://authenticatie-ti.vlaanderen.be/op/v1/auth',
          scope: 'openid vo profile ABBDatabankToezicht',
          redirectUri: 'https://besluiten.abb.lblod.info/authorization/callback',
          logoutUrl: 'https://authenticatie-ti.vlaanderen.be/op/v1/logout'
        }
      }
    }
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
    ENV['torii']['providers']['acmidm-oauth2']['apiKey'] = '581c5176-1a08-48d6-a9ef-e6fb95fe6010';
    ENV['torii']['providers']['acmidm-oauth2']['baseUrl'] = 'https://authenticatie.vlaanderen.be/op/v1/auth';
    ENV['torii']['providers']['acmidm-oauth2']['redirectUri'] = 'https://besluiten.abb.vlaanderen.be/authorization/callback';
    ENV['torii']['providers']['acmidm-oauth2']['logoutUrl'] = 'https://authenticatie.vlaanderen.be/op/v1/logout';
  }

  return ENV;
};
