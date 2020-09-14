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
