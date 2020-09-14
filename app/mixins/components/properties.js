import Mixin from '@ember/object/mixin';
import PropTypeMixin from 'ember-prop-types';

import { typeOf } from '@ember/utils';
import { setProperties } from '@ember/object';

export default Mixin.create(PropTypeMixin, {
  resetDefaultProps: function() {
    if (this.isDestroyed || this.isDestroying) return false;

    const defaults = this.getDefaultProps;

    defaults.forEach(propsFunction => {
      if (typeOf(propsFunction) !== 'function') {
        return;
      }

      const defaultProps = propsFunction.apply(this);

      try {
        setProperties(this, defaultProps);
      } catch (e) {
        // Do nothing
      }
    });
  }
});
