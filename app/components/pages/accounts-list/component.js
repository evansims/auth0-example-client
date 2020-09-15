import Component from '@ember/component';

import { task, timeout } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { get, set, computed, observer } from '@ember/object';

export default Component.extend({
  session: service(),
  store: service(),

  elementId: 'page-users-list',
  classNames: [],

  users: [],
  search: '',

  props: {
    querying: false,
    queryingInitial: true,
    moreResults: false,
    page: 0,
  },

  didInsertElement: function() {
    this._super(...arguments);

    // Load users when component is rendered on page.
    this.loadUsers();
  },

  // Monitor our Auth0 session service for state changes
  watchAuthenticationState: observer(
    'session.{authenticated,token}',
    function() {
      this.loadUsers();
    },
  ),

  // Monitor our 'search' string for changes.
  watchSearchState: observer('search', function() {
    // Wait for user to finish typing before sending out user search requests.
    get(this, 'debounceSearch').perform();
  }),

  // Reset component state
  clearUsers: function() {
    set(this, 'users', []);
    set(this, 'props.querying', false);
    set(this, 'props.moreResults', false);
    set(this, 'props.page', 0);

    get(this, 'getUsersPaginated').cancelAll();
  },

  // Begin a new user list query
  loadUsers: function() {
    // Reset component state.
    this.clearUsers();

    // Reset our user search delay, if one is running.
    get(this, 'debounceSearch').cancelAll();

    // Only issue user list requests if the session is authenticated.
    if (get(this, 'session.authenticated') && get(this, 'session.token')) {
      get(this, 'getUsersPaginated').perform();
    }
  },

  // Helper function to delay sending user search requests as the user is typing.
  debounceSearch: task(function*() {
    // Reset component state.
    this.clearUsers();

    // Debounce the search, waiting 1.5s before issuing the API request.
    yield timeout(1500);

    // Issue the search.
    this.loadUsers();
  }).restartable(),

  // Query our custom backend for a list of matching users.
  // Query consecutively for additional paginated results.
  getUsersPaginated: task(function*() {
    set(this, 'props.moreResults', false);
    set(this, 'props.querying', true);

    // Build our Ember Data query
    yield get(this, 'store')
      .query('user', {
        // For paginated results, send a page number (begins at 0)
        page: get(this, 'props.page'),
        // For filtered results, provide a search term
        q: get(this, 'search'),
      })
      .then(users => {
        // If the component has been removed from the DOM, do nothing.
        if (!this || this.isDestroyed || this.isDestroying) {
          return;
        }

        // If we received users, push them into our Ember Data model array for rendering.
        if (get(users, 'length')) {
          get(this, 'users').pushObjects(users.toArray().slice());
        }

        // Increment our pagination counter for future requests.
        this.incrementProperty('props.page');

        // If we get the maximum number of results back, assume there may be more available.
        if (users.length === 5) {
          set(this, 'props.moreResults', true);
        }

        // Update state, we no longer have an active query.
        set(this, 'props.querying', false);
      })
      .catch(e => {
        // If the component has been removed from the DOM, do nothing.
        if (!this || this.isDestroyed || this.isDestroying) {
          return;
        }

        // Update state, we no longer have an active query.
        set(this, 'props.querying', false);
      })
      .finally(() => {
        // If the component has been removed from the DOM, do nothing.
        if (!this || this.isDestroyed || this.isDestroying) {
          return;
        }

        // Update state, our first query is complete, successful or not.
        set(this, 'props.queryingInitial', false);
      });
  }).enqueue(),

  actions: {
    // Called from the template to render the next page of user results.
    loadMoreResults: function() {
      get(this, 'getUsersPaginated').perform();
    },
  },
});
