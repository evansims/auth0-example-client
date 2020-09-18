import Route from '@ember/routing/route';
import ResetScroll from '../mixins/routers/reset-scroll';

import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';

export default Route.extend(ResetScroll, {
  session: service(),

  // Our /callback route will accept 'code' and 'state' parameters returned by Auth0
  queryParams: {
    code: {
      refreshModel: true,
    },
    state: {
      refreshModel: true,
    },
  },

  model: function(params) {
    // Return a faux model containing Auth0's code and state response.
    return {
      code: params.code ?? null,
      state: params.state ?? null,
    };
  },

  afterModel: function(model, transition) {
    // Did the faux model we built in model() contain the required parameters?
    if (model.code && model.state) {
      // Get the auth0 object from our session service.
      let auth0 = get(this, 'session.auth0');

      auth0
        // Have Auth0 process the code and state parameters we were passed.
        .handleRedirectCallback()
        .then(() => {
          // Now, let's find out if we successfully authenticated
          return auth0.isAuthenticated();
        })
        .then(state => {
          // Store whether we are authenticated or not.
          if (!state) {
            set(this, 'session.authenticated', false);
            set(this, 'session.token', null);
            this.replaceWith('index');
            return;
          }

          get(this, 'session')
            .getToken()
            .then(token => {
              set(this, 'session.authenticated', true);
              this.replaceWith('index');
              return;
            });
        })
        .catch(() => {
          // Return the user to the index page.
          this.replaceWith('index');
        });

      // We're done!
      return;
    }

    // Nothing to process, take us home.
    this.replaceWith('index');
  },
});
