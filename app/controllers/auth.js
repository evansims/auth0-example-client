import Controller from '@ember/controller';
import QueryParams from 'ember-parachute';

import { inject as service } from '@ember/service';
import { set } from '@ember/object';
import { on } from '@ember/object/evented';

export const routeQueryParams = new QueryParams({
  error: {
    defaultValue: '',
    refresh: false,
    replace: true,
  },
});

export default Controller.extend(routeQueryParams.Mixin, {
  session: service(),

  passedErrorQuery: '',

  onSetup: on('setup', function(parachute) {
    if (parachute.changed.error) {
      if (
        parachute.queryParams.error &&
        parachute.queryParams.error.length !== 0
      ) {
        set(this, 'passedErrorQuery', parachute.queryParams.error);

        this.replaceRoute('auth', { queryParams: { error: null } });
        this.resetQueryParams();

        return;
      }
    }
  }),
});
