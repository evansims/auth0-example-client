import Component from '@ember/component';

import { task, timeout } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { once } from '@ember/runloop';
import { get, set, computed, observer } from '@ember/object';
import { debounce } from '@ember/runloop';

export default Component.extend({
  session: service(),
  store: service(),

  elementId: 'page-users-list',
  classNames: [],

  users: [],
  search: '',

  props: {
    cache: [],
    querying: false,
    queryingInitial: true,
    searchPrevious: '',
    moreResults: false,
    page: 0,
  },

  didInsertElement: function() {
    this._super(...arguments);
    this.loadUsers();
  },

  watchAuthenticationState: observer(
    'session.{authenticated,token}',
    function() {
      this.loadUsers();
    },
  ),

  watchSearchState: observer('search', function() {
    get(this, 'debounceSearch').perform();
  }),

  clearUsers: function() {
    set(this, 'users', []);
    set(this, 'props.cache', []);
    set(this, 'props.querying', false);
    set(this, 'props.searchPrevious', '');
    set(this, 'props.moreResults', false);
    set(this, 'props.page', 0);

    get(this, 'getUsersPaginated').cancelAll();
  },

  loadUsers: function() {
    console.log('loadUsers');

    this.clearUsers();

    get(this, 'debounceSearch').cancelAll();

    if (get(this, 'session.authenticated') && get(this, 'session.token')) {
      get(this, 'getUsersPaginated').perform();
    }
  },

  debounceSearch: task(function*() {
    this.clearUsers();
    yield timeout(1500);
    this.loadUsers();
  }).restartable(),

  getUsersPaginated: task(function*() {
    set(this, 'props.moreResults', false);
    set(this, 'props.querying', true);

    yield get(this, 'store')
      .query('user', {
        page: get(this, 'props.page'),
        q: get(this, 'search'),
      })
      .then(users => {
        if (!this || this.isDestroyed || this.isDestroying) {
          return;
        }

        if (get(users, 'length')) {
          get(this, 'users').pushObjects(users.toArray().slice());
        }

        this.incrementProperty('props.page');

        if (users.length === 5) {
          set(this, 'props.moreResults', true);
        }

        if (get(this, 'props.searchPrevious') !== get(this, 'search')) {
          set(this, 'props.searchPrevious', get(this, 'search'));
        }

        set(this, 'props.querying', false);
      })
      .catch(e => {
        if (!this || this.isDestroyed || this.isDestroying) {
          return;
        }

        set(this, 'props.querying', false);
      })
      .finally(() => {
        if (!this || this.isDestroyed || this.isDestroying) {
          return;
        }

        set(this, 'props.queryingInitial', false);
      });
  }).enqueue(),

  actions: {
    loadMoreResults: function() {
      get(this, 'getUsersPaginated').perform();
    },
  },
});
