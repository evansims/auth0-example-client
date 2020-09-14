import Service from '@ember/service';
import ENV from '../config/environment';
import RSVP from 'rsvp';

import { get, set } from '@ember/object';

export default Service.extend({
  auth0: null,
  token: null,
  authenticated: false,

  // Initialize the Auth0 client and check our authentication state.
  getSession: function() {
    return new RSVP.Promise((resolve, reject) => {
      // Create our Auth0 client using the credentials specified in your environment file
      window
        .createAuth0Client({
          domain: ENV.auth0.domain,
          client_id: ENV.auth0.clientId,
          redirect_uri: ENV.auth0.callbackUrl,
          audience: ENV.auth0.audience,
        })
        .then(auth0 => {
          // Store the Auth0 client for use later
          set(this, 'auth0', auth0);

          // Check if we're authenticated or not
          return auth0.isAuthenticated();
        })
        .then(state => {
          // Store the authentication state for use in the app
          set(this, 'authenticated', state);

          if (!state) {
            return resolve();
          }

          // Get our API token for communicating with the API directly
          return get(this, 'auth0').getTokenSilently();
        })
        .then(token => {
          // Store the API token for use later
          set(this, 'token', token);

          // Complete the getSession promise
          return resolve();
        })
        .catch(() => {
          // Abort the getSession promise
          return reject();
        });
    });
  },

  getUser: function() {
    return new RSVP.Promise((resolve, reject) => {
      if (!get(this, 'authenticated')) {
        return reject();
      }

      get(this, 'auth0')
        .getUser()
        .then(user => {
          return resolve(user);
        })
        .catch(() => {
          return reject();
        });
    });
  },

  releaseSession: function() {
    // Sign out of Auth0 session.
    get(this, 'auth0').logout({
      returnTo: window.location.origin,
    });
  },
});
