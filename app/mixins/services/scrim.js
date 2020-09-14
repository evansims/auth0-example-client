import Mixin from '@ember/object/mixin';
import { typeOf } from '@ember/utils';

import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import { set } from '@ember/object';

export default Mixin.create({
  scrim: service(),

  activeChild: computed('openChildren.@each', function() {
    const overlays = get(this, 'openChildren.firstObject');
    return overlays ? overlays : false;
  }),

  previousActiveChild: computed('activeChild', function() {
    const currentModal = this.activeChild;
    const previousModal = this.previousChild;

    if (previousModal !== currentModal) {
      if (currentModal) {
        set(this, 'previousChild', currentModal);
      }
    }

    return this.previousChild;
  }),

  afterRegisterChild: function() {
    this.scrim.registerChild(this);
  },

  openTarget: function(target, payload) {
    if (typeOf(target) === 'string') {
      const matches = this.mixinRegistrationHandlerCollection
        .compact()
        .filterBy(this.propModalName, target);

      if (get(matches, 'length')) {
        target = matches[0];
      }
    }

    if (typeOf(target) === 'instance') {
      if (!get(target, this.propModalState)) {
        set(target, this.propModalState, true);
        set(target, 'state_payload', payload);

        if (typeof this.onChildInvoked === 'function') {
          this.onChildInvoked(target, payload);
        }

        return target;
      }
    }

    return null;
  },

  collapseAll: function(exception, requestOrigin = null) {
    this.mixinRegistrationHandlerCollection
      .compact()
      .without(exception)
      .forEach(child => {
        if (child) {
          this.collapseTarget(child, requestOrigin);
        }
      });
  },

  collapseTarget: function(target, requestOrigin = null) {
    if (typeOf(target) === 'string') {
      const matches = this.mixinRegistrationHandlerCollection
        .compact()
        .filterBy(this.propModalName, target);

      if (get(matches, 'length')) {
        target = matches[0];
      }
    }

    if (typeOf(target) === 'instance') {
      if (get(target, this.propModalState)) {
        set(target, this.propModalState, false);

        if (typeof this.onChildDismissed === 'function') {
          this.onChildDismissed(target, requestOrigin);
        }
      }

      return target;
    }

    return null;
  },
});
