import Service from '@ember/service';
import RSVP from 'rsvp';

export default Service.extend({
  clear: function(key) {
    return new RSVP.Promise(resolve => {
      if (key) {
        window.localStorage.removeItem(key);
        resolve();
      }
    });
  },

  push: function(key, value) {
    return new RSVP.Promise(resolve => {
      if (key) {
        if (value !== undefined && value !== null) {
          window.localStorage.setItem(key, JSON.stringify(value));
          resolve();
          return;
        }

        window.localStorage.removeItem(key);
        resolve();
      }
    });
  },

  pull: function(key) {
    return new RSVP.Promise(resolve => {
      var result = window.localStorage.getItem(key);

      try {
        result = result ? JSON.parse(result) : undefined;
      } catch (e) {
        result = {};
      }

      resolve(result);
    });
  },

  pullSync: function(key) {
    var result = window.localStorage.getItem(key);

    try {
      result = result ? JSON.parse(result) : undefined;
    } catch (e) {
      result = {};
    }

    return result;
  },
});
