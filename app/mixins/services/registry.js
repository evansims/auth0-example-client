import Mixin from '@ember/object/mixin';

export default Mixin.create({
  registerChild: function(component) {
    if (!this.mixinRegistrationHandlerCollection.includes(component)) {
      this.mixinRegistrationHandlerCollection.addObject(component);

      if (typeof this.afterRegisterChild === 'function') {
        this.afterRegisterChild(component);
      }
    }
  },

  deregisterChild: function(component) {
    if (this.mixinRegistrationHandlerCollection.includes(component)) {
      this.mixinRegistrationHandlerCollection.removeObject(component);

      if (typeof this.afterDeregisterChild === 'function') {
        this.afterDeregisterChild(component);
      }
    }
  }
});
