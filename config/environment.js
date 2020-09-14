module.exports = function(environment) {
  const ENV = {
    modulePrefix: 'auth0client',
    environment,
    rootURL: '/',
    locationType: 'auto',

    fontawesome: {
      defaultPrefix: 'fal',
    },

    EmberENV: {
      LOG_STACKTRACE_ON_DEPRECATION: false,
    },

    auth0: {
      clientId: '',
      domain: '',
      audience: '',
      callbackUrl: 'http://localhost:3000/callback',
    },

    APP: {
      apiHost: 'http://localhost:8000',
    },

    i18n: {
      defaultLocale: 'en',
    },
  };

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  return ENV;
};
