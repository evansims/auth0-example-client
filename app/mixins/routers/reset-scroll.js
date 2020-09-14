import Mixin from '@ember/object/mixin';

import { inject as service } from '@ember/service';
import { get, set } from '@ember/object';

export default Mixin.create({
  routing: service(),
  client: service(),

  actions: {
    willTransition(transition) {
      // Ignore scroll reset in fastboot
      if (window && window.scrollTo) {
        set(this, 'client.willTransitionResetScroll', false);

        let currentRoute = get(this, 'routing.currentRouteName');
        let nextRoute = transition.targetName;

        if (currentRoute && nextRoute) {
          currentRoute = currentRoute.replace('.index', '').split('.');
          nextRoute = nextRoute.replace('.index', '').split('.');

          if (currentRoute[0] !== nextRoute[0]) {
            set(this, 'client.willTransitionResetScroll', true);
          }
        }
      }

      return true;
    },

    didTransition() {
      // Ignore scroll reset in fastboot
      if (
        window &&
        window.scrollTo &&
        get(this, 'client.willTransitionResetScroll')
      ) {
        window.scrollTo(0, 0);
      }

      return true;
    },
  },
});
