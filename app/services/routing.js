import Service from '@ember/service';

import { inject as service } from '@ember/service';
import { computed, get, set } from '@ember/object';

export default Service.extend({
  router: service(),
  routing: service('-routing'),

  routeTransition: null,

  currentRouteName: computed('routing.currentRouteName', function() {
    return get(this, 'routing.currentRouteName');
  }),

  currentPath: computed('routing.currentPath', function() {
    return get(this, 'routing.currentPath');
  }),

  getLibrary: function() {
    const router = get(this, 'routing.router');
    const lib = router._routerMicrolib || router.router;
    return lib;
  },

  getUrl: function(target, stack, queryParams = null) {
    let router = get(this, 'routing');
    let params = [];

    if (stack) {
      if (stack.params) {
        params = Object.values(stack.params).filter(param => {
          return Object.values(param).length;
        });
      }

      try {
        return router.generateURL(target, params, queryParams);
      } catch (e) {}
    }

    return null;
  },

  transitionUrl: computed('routeTransition', function() {
    let transition = get(this, 'routeTransition');

    if (transition) {
      return this.getUrl(
        transition.targetName,
        transition,
        transition.queryParams,
      );
    }

    return null;
  }),

  cacheTransition: function(transition) {
    set(this, 'routeTransition', transition);
  },

  forgetTransition: function() {
    set(this, 'routeTransition', null);
  },

  collapseRouteUrl: function() {
    const routerLib = this.getLibrary();
    const handlerInfos = routerLib.state.handlerInfos;
    const currentController =
      handlerInfos[handlerInfos.length - 1]._handler.controller;

    if (currentController._isModalRoute) {
      routerLib.transitionTo(handlerInfos[handlerInfos.length - 2].name);
      return;
    }

    let routeName = get(this, 'routing.currentRouteName');
    let routePath = handlerInfos;
    let routeParams = null;

    routerLib.updateURL(this.getUrl(routeName, routePath, routeParams));
  },

  replaceWith: function(routeName, ...args) {
    get(this, 'routing').replaceWith(routeName, args);
  },

  transitionTo: function(routeName, ...args) {
    get(this, 'routing').transitionTo(routeName, args);
  },
});
