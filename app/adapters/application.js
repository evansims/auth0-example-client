import JSONAPIAdapter from 'ember-data/adapters/json-api';
import ENV from '../config/environment';

import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import { isEmpty } from '@ember/utils';

export default JSONAPIAdapter.extend({
  session: service(),

  maxURLLength: 256,
  coalesceFindRequests: true,

  host: ENV.APP.apiHost,

  ajaxOptions: function(url, type, options) {
    let token = get(this, 'session.token');

    if (isEmpty(options)) {
      options = {};
    }

    if (isEmpty(options.data)) {
      options.data = {};
    }

    if (token) {
      options.data.token = token;
    }

    return this._super(url, type, options);
  },
});
