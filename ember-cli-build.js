const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  const app = new EmberApp(defaults, {
    storeConfigInMeta: false,

    fingerprint: {
      enabled: false,
    },

    'ember-cli-babel': {
      includePolyfill: true,
    },

    postcssOptions: {
      compile: {
        extension: 'scss',
        enabled: true,
        browsers: ['last 3 versions'],
        parser: require('postcss-scss'),
        plugins: [
          {
            module: require('@csstools/postcss-sass'),
            options: {
              includePaths: ['node_modules'],
            },
          },
          require('tailwindcss')('./app/tailwind.config.js'),
        ],
      },
    },

    nodeAssets: {
      '@auth0/auth0-spa-js': {
        import: [
          'dist/auth0-spa-js.development.js',
          'dist/auth0-spa-js.development.map',
        ],
      },
      niceware: {
        import: ['browser/niceware.js'],
      },
      'js-base64': {
        import: ['base64.js'],
      },
    },
  });

  return app.toTree();
};
