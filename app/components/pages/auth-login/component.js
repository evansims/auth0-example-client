import Component from '@ember/component';

import { inject as service } from '@ember/service';
import { once } from '@ember/runloop';
import { get, set, computed } from '@ember/object';

export default Component.extend({
  session: service(),

  elementId: 'page-auth-login',
  classNames: [],

  props: {
    processing: false,
  },

  actions: {
    doAuthentication: function() {
      if (get(this, 'props.processing')) {
        return;
      }

      set(this, 'props.processing', true);

      get(this, 'session.auth0').loginWithRedirect();
    },
  },
});
