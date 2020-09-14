import Mixin from '@ember/object/mixin';
import { get } from '@ember/object';
import { run } from '@ember/runloop';
import { getOwner } from '@ember/application';
import { inject as service } from '@ember/service';

export default Mixin.create({
  modals: service(),
  routing: service(),

  setupController(controller, model) {
    this._super(controller, model);
    controller._isModalRoute = true;
  },

  renderTemplate: function() {
    this.render({
      into: 'application',
      outlet: 'modal-content',
    });
  },

  beforeModel: function(transition) {
    this._super(...arguments);

    // Open modal overlay
    this.modals.openTarget('router');

    // Cache this transition for later
    this.routing.cacheTransition(transition);

    if (
      transition.isCausedByInitialTransition ||
      typeof transition.isCausedByInitialTransition === 'undefined'
    ) {
      this.intermediateTransitionTo(
        transition.handlerInfos[transition.handlerInfos.length - 2].name,
      );
    }
  },

  afterModel: function(model, transition) {
    this._super(...arguments);

    // Open modal overlay
    this.modals.openTarget('router');

    if (
      !transition.isCausedByInitialTransition ||
      typeof transition.isCausedByInitialTransition !== 'undefined'
    ) {
      const routerLib = this.routing.getLibrary();

      if (get(this, 'routing.currentRouteName') !== transition.targetName) {
        try {
          this.enter();
          this.setup(model, transition);
        } catch (e) {
          //
        }

        getOwner(this).lookup('route:application').connections = getOwner(this)
          .lookup('route:application')
          .connections.concat(this.connections);

        transition.abort();
        // return;
      }

      let url = get(this, 'routing.transitionUrl');
      routerLib.updateURL(url);
      this.routing.forgetTransition();
    }

    run.schedule('afterRender', this, function() {
      this.modals.openTarget('router');
    });
  },

  actions: {
    loading(transition, originRoute) {
      this.modals.openTarget('router');

      let templateName = `${originRoute.routeName}-loading`;
      let lookupTemplate = getOwner(this).lookup(`template:${templateName}`);

      if (!lookupTemplate) {
        templateName = `modal-loading`;
        lookupTemplate = getOwner(this).lookup(`template:${templateName}`);

        if (!lookupTemplate) {
          return false;
        }
      }

      const oldTemplateName = this.templateName;
      const oldControllerName = this.controllerName;

      this.templateName = templateName;
      this.controllerName = 'routableModalLoading';

      this.enter();
      this.setup();

      if (!this.connections) {
        this.connections = [];
      }

      if (!getOwner(this).lookup('route:application').connections) {
        getOwner(this).lookup('route:application').connections = [];
      }

      getOwner(this).lookup('route:application').connections = getOwner(this)
        .lookup('route:application')
        .connections.concat(this.connections);

      this.templateName = oldTemplateName;
      this.controllerName = oldControllerName;

      return false;
    },
  },
});
