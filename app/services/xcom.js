import Service from '@ember/service';
import Evented from '@ember/object/evented';

export default Service.extend(Evented, {
  publish: function(...args) {
    return this.trigger.apply(this, args);
  },

  subscribe: function(...args) {
    return this.on.apply(this, args);
  },

  unsubscribe: function(...args) {
    return this.off.apply(this, args);
  }
});
