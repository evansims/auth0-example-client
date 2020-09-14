import Controller from '@ember/controller';
import QueryParams from 'ember-parachute';

import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import { on } from '@ember/object/evented';

export const routeQueryParams = new QueryParams({
  token: {
    defaultValue: null,
    refresh: false,
    replace: true,
  },
  autherr: {
    defaultValue: null,
    refresh: false,
    replace: true,
  },
  feed: {
    defaultValue: null,
    refresh: true,
    replace: false,
  },
});

export default Controller.extend(routeQueryParams.Mixin, {
  client: service(),
  session: service(),
  routing: service(),
  storage: service(),
  site: service(),

  onSetup: on('setup', function(queryParams) {
    if (queryParams.changed.autherr) {
      this.replaceRoute('auth', {
        queryParams: { error: queryParams.changed.autherr },
      });
      return;
    }

    if (queryParams.changed.token) {
      this.session.getSession(queryParams.changed.token).finally(() => {
        this.storage
          .pull(get(this, 'site.meta.site.storage') + ':auth-direct')
          .then(redirect => {
            this.replaceRoute('index', { queryParams: { token: null } });

            if (redirect) {
              this.storage.clear(
                get(this, 'site.meta.site.storage') + ':auth-direct',
              );
              this.replaceRoute(redirect);
              return;
            }
          })
          .catch(() => {
            this.resetQueryParams();
          });

        return;
      });
    }
  }),
});
