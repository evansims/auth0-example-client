import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import ENV from '../config/environment';

import { inject as service } from '@ember/service';
import { get, set, setProperties } from '@ember/object';

export default Route.extend({
  session: service(),
  site: service(),

  model: function() {
    return new RSVP.Promise((resolve, reject) => {
      let site = get(this, 'site');

      set(site, 'appLoadingState', 'state_authenticating');

      // Authenticate session, if available.
      get(this, 'session')
        .getSession()
        .finally(() => {
          setProperties(site, {
            appLoadingState: 'state_ready',
            stateLoadingComplete: true,
          });

          resolve();
        });
    });
  },
});
