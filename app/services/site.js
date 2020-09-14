import Service from '@ember/service';
import RSVP from 'rsvp';
import ENV from '../config/environment';

import { computed, get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { hrefTo } from 'ember-href-to/helpers/href-to';

export default Service.extend({
  ajax: service(),
  store: service(),

  meta: null,

  appLoadingState: null,
  appLoadingComplete: false,

  getMeta: function(reload) {
    reload = reload || false;

    if (!reload && get(this, 'meta')) {
      return new RSVP.Promise(resolve => {
        return resolve(get(this, 'meta'));
      });
    }

    if (window.auth0 && window.auth0.metadata) {
      return new RSVP.Promise(resolve => {
        set(this, 'meta', window.auth0.metadata);
        return resolve(window.auth0.metadata);
      });
    }

    return new RSVP.Promise((resolve, reject) => {
      get(this, 'ajax')
        .request(ENV.APP.apiHost + '/v1/meta', { method: 'GET' })
        .then(response => {
          set(this, 'meta', response.meta);

          return resolve(get(this, 'meta'));
        })
        .catch(error => {
          return reject(error);
        });
    });
  },

  isPrivateBrowsing: computed('navigator.doNotTrack', function() {
    return !!(navigator.doNotTrack || 0);
  }),

  generateLink: function(targetRouteName, ...rest) {
    let baseUrl =
      location.protocol +
      '//' +
      location.hostname +
      (location.port ? ':' + location.port : '');

    let url = hrefTo(this, targetRouteName, ...rest);

    return baseUrl + url;
  },
});
