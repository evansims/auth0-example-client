import Component from '@ember/component';

import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default Component.extend({
  session: service(),

  tagName: '',

  actions: {
    logout: function() {
      get(this, 'session').releaseSession();
    },
  },
});
