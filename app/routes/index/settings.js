import Route from '@ember/routing/route';

import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default Route.extend({
  xcom: service(),
  session: service(),

  beforeModel: function() {
    const session = this.session;

    if (!get(session, 'session.id')) {
      this.transitionTo('index');
      return;
    }
  },

  actions: {
    willTransition: function() {
      this.xcom.publish('closeModal', 'account-settings');
      return true;
    },
  },
});
