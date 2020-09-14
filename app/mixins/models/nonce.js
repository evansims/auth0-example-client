import Mixin from '@ember/object/mixin';
import DS from 'ember-data';
import RSVP from 'rsvp';
import attr from 'ember-data/attr';
import Inflector from 'ember-inflector';

import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import { set } from '@ember/object';

export default Mixin.create({
  nonceService: service('nonce'),
  nonce: attr('string'),

  purgeRecord: function() {
    return DS.PromiseObject.create({
      promise: new RSVP.Promise((resolve, reject) => {
        let modelName = get(this, 'constructor.modelName');
        modelName = modelName ? Inflector.inflector.pluralize(modelName) : null;

        if (modelName) {
          let modelId = this.id;
          let endpoint = `/${modelName}/${modelId}`;
          let method = 'DELETE';

          this.nonceService
            .generate(method, endpoint)
            .then(nonce => {
              // this.nonce = nonce;

              try {
                set(this, 'nonce', nonce);
              } catch (e) {}

              this.destroyRecord()
                .then(() => {
                  resolve();
                })
                .catch(error => {
                  reject(error);
                });
            })
            .catch(error => {
              reject(error);
            });

          return;
        }

        reject();
      }),
    });
  },

  save: function(options) {
    return DS.PromiseObject.create({
      promise: new RSVP.Promise((resolve, reject) => {
        if (!this.isDeleted) {
          let modelName = get(this, 'constructor.modelName');
          modelName = modelName
            ? Inflector.inflector.pluralize(modelName)
            : null;

          if (modelName) {
            let modelId = this.id;
            let endpoint = `/${modelName}`;
            let method = 'POST';

            // Are we creating a record, or updating one?
            if (modelId) {
              endpoint += `/${modelId}`;
              method = 'PATCH';
            }

            if (this.isDeleted) {
              method = 'DELETE';
            }

            this.nonceService
              .generate(method, endpoint)
              .then(nonce => {
                try {
                  // this.nonce = nonce;
                  set(this, 'nonce', nonce);
                } catch (e) {}

                this._internalModel
                  .save(options)
                  .then(() => {
                    // unset(this.nonce);
                    set(this, 'nonce', undefined);
                    set(this, 'currentState.isDirty', false);

                    resolve(this);
                  })
                  .catch(error => {
                    reject(error);
                  });
              })
              .catch(error => {
                reject(error);
              });

            return;
          }
        }

        this._internalModel
          .save(options)
          .then(() => {
            resolve(this);
          })
          .catch(error => {
            reject(error);
          });
      }),
    });
  },
});
