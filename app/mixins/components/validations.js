import Mixin from '@ember/object/mixin';
import XRegExp from 'xregexp';

import { get } from '@ember/object';
import { set } from '@ember/object';
import { run } from '@ember/runloop';
import { addObserver } from '@ember/object/observers';
import { removeObserver } from '@ember/object/observers';
import { task, timeout } from 'ember-concurrency';

export default Mixin.create({
  propValidations: null,
  propsWatched: null,
  propsValid: null,
  propValid: null,

  init: function() {
    this._super(...arguments);

    if (!this.propValidations) {
      set(this, 'propValidations', {});
    }

    if (!this.propsWatched) {
      set(this, 'propsWatched', []);
    }

    if (!this.propsValid) {
      set(this, 'propsValid', false);
    }

    if (!this.propValid) {
      set(this, 'propValid', {});
    }

    let rules = this.propValidations;

    if (rules) {
      let properties = Object.keys(rules);

      properties.forEach(prop => {
        addObserver(this, prop, this, this.scheduleUpdatePropsValid);
        set(this, 'propValid.' + prop, false);
      }, this);

      run.schedule('afterRender', this, function() {
        this.scheduleUpdatePropsValid();
      });
    }
  },

  willDestroy: function() {
    this._super(...arguments);

    this.updatePropsValid.cancelAll();

    let rules = this.propValidations;

    if (rules) {
      let properties = Object.keys(rules);

      properties.forEach(prop => {
        removeObserver(this, prop, this, this.scheduleUpdatePropsValid);
      }, this);
    }
  },

  scheduleUpdatePropsValid: function() {
    this.updatePropsValid.perform();
  },

  updatePropsValid: task(function*() {
    yield timeout(200);
    set(this, 'propsValid', this.validateProps());
  }).keepLatest(),

  validateProps: function() {
    let rules = this.propValidations;

    if (rules) {
      let properties = Object.keys(rules);
      let response = true;

      properties.forEach(prop => {
        let valid = this.validateProp(prop);

        set(this, 'propValid.' + prop, valid);

        if (!valid) {
          response = false;
        }
      });

      return response;
    }

    return true;
  },

  validateProp: function(propName) {
    let propRegex = get(this, 'propValidations.' + propName);

    if (propRegex) {
      let propValue = get(this, propName);

      if (!propValue) {
        return false;
      }

      if (propRegex === 'email') {
        propRegex = new XRegExp(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        );
      } else {
        propRegex = propRegex.replace(
          '\\p{Emoji}',
          '\\u{1f300}-\\u{1f5ff}\\u{1f900}-\\u{1f9ff}\\u{1f600}-\\u{1f64f}\\u{1f680}-\\u{1f6ff}\\u{2600}-\\u{26ff}\\u{2700}-\\u{27bf}\\u{1f1e6}-\\u{1f1ff}\\u{1f191}-\\u{1f251}\\u{1f004}\\u{1f0cf}\\u{1f170}-\\u{1f171}\\u{1f17e}-\\u{1f17f}\\u{1f18e}\\u{3030}\\u{2b50}\\u{2b55}\\u{2934}-\\u{2935}\\u{2b05}-\\u{2b07}\\u{2b1b}-\\u{2b1c}\\u{3297}\\u{3299}\\u{303d}\\u{00a9}\\u{00ae}\\u{2122}\\u{23f3}\\u{24c2}\\u{23e9}-\\u{23ef}\\u{25b6}\\u{23f8}-\\u{23fa}',
        );

        propRegex = new XRegExp(propRegex, 'u');
      }

      if (!propRegex.test(propValue)) {
        return false;
      }
    }

    return true;
  },
});
