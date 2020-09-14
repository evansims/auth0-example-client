import Mixin from '@ember/object/mixin';

export default Mixin.create({
  unloadRecord() {
    this._super();
    this.store._removeFromIdMap(this._internalModel);
  }
});
