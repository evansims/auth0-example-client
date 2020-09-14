import { equal } from '@ember/object/computed';
import Mixin from '@ember/object/mixin';
import Properties from './properties';

import { addObserver, removeObserver } from '@ember/object/observers';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';
import { computed, set, get } from '@ember/object';
import { on } from '@ember/object/evented';
import { typeOf } from '@ember/utils';
import { isArray } from '@ember/array';

export default Mixin.create(Properties, {
  i18n: service('intl'),
  xcom: service('xcom'),

  attributeBindings: [
    'ariaHidden:aria-hidden',
    'ariaLive:aria-live',
    'ariaLabel:aria-label',
    'ariaRole:role',
  ],

  ariaRole: null,
  ariaLive: null,
  ariaLabel: null,
  ariaHidden: false,
  componentProcessing: false,

  componentReady: equal('componentProcessing', false),

  // Events
  mixinSetupComponentSetupEvent: on('didInsertElement', function() {
    if (typeof this.setupComponent === 'function') {
      run.schedule('afterRender', this, function() {
        this.setupComponent();
      });
    }
  }),

  mixinSetupComponentTeardownEvent: on('willDestroyElement', function() {
    let observedProperties = get(this, 'observedPropertiesCache');

    if (observedProperties) {
      observedProperties.forEach(prop => {
        removeObserver(prop[0], prop[1], prop[3] || this, prop[2]);
      });
    }

    if (typeof this.teardownComponent === 'function') {
      this.teardownComponent();
    }
  }),

  invoke: function(target, action, ...args) {
    let targetAction = target && target.actions && target.actions[action];

    if (targetAction && typeof targetAction === 'function') {
      return targetAction.call(target, ...args);
    }
  },

  parseErrorResponse(response, autofocus = null) {
    let error = null;

    if (response) {
      if (response.errors && response.errors[0]) {
        error = response.errors[0];
      } else if (
        response.payload &&
        response.payload.errors &&
        response.payload.errors[0]
      ) {
        error = response.payload.errors[0];
      }
    }

    if (autofocus && error && error.source && error.source.parameter) {
      run.schedule('afterRender', this, function() {
        try {
          let element = document.getElementById(
            autofocus + error.source.parameter,
          );

          if (element) {
            element.focus();
          }
        } catch (error) {}
      });
    }

    return error;
  },

  observeProperties: function(props) {
    set(this, 'observedPropertiesCache', props);

    props.forEach(prop => {
      if (isArray(prop[1])) {
        prop[1].forEach(prop1 => {
          addObserver(prop[0], prop1, prop[3] || this, prop[2]);
        });
      } else {
        addObserver(prop[0], prop[1], prop[3] || this, prop[2]);
      }
    });
  },

  // Actions
  actions: {
    showModal: function(modalName) {
      get(this, 'xcom').publish('showModal', modalName);
    },

    showMenu: function(menuName, ...args) {
      let payload = {};

      if (isArray(args)) {
        args.forEach(arg => {
          let properties = Object.keys(arg);

          properties.forEach(prop => {
            let type = typeOf(arg[prop]);

            if (type === 'object' || type === 'instance' || type === 'class') {
              payload[prop] = arg[prop];
            }
          }, this);
        }, this);
      }

      let host = payload.host || null;
      let context = payload.context || null;
      let element = payload.element || null;
      let color = payload.color || null;

      get(this, 'xcom').publish(
        'showMenu',
        menuName,
        host,
        context,
        element,
        color,
      );

      return false;
    },
  },
});
