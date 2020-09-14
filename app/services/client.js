import Service from '@ember/service';

import { getOwner } from '@ember/application';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Service.extend({
  willTransitionResetScroll: false,

  isFastBoot: computed(function() {
    const fastboot = getOwner(this).lookup('service:fastboot');
    return fastboot ? fastboot.get('isFastBoot') : false;
  }),

  getAddEventListener: computed(function() {
    return window.addEventListener ? 'addEventListener' : 'attachEvent';
  }),

  getRemoveEventListener: computed(function() {
    return window.addEventListener ? 'removeEventListener' : 'detachEvent';
  }),

  getTransitionEvent: computed(function() {
    let t;
    let el = document.createElement('fakeelement');

    let transitions = {
      transition: 'transitionend',
      WebkitTransition: 'webkitTransitionEnd',
      msTransition: 'msTransitionEnd',
      OTransition: 'oTransitionEnd',
    };

    for (t in transitions) {
      if (el.style[t] !== undefined) {
        return transitions[t];
      }
    }
  }),

  getAnimationStartEvent: computed(function() {
    let a;
    let el = document.createElement('fakeelement');

    let animations = {
      transition: 'animationstart',
      WebkitTransition: 'webkitAnimationStart',
      msTransition: 'msAnimationStart',
      OTransition: 'oanimationstart',
    };

    for (a in animations) {
      if (el.style[a] !== undefined) {
        return animations[a];
      }
    }
  }),

  getAnimationEndEvent: computed(function() {
    let a;
    let el = document.createElement('fakeelement');

    let animations = {
      transition: 'animationend',
      WebkitTransition: 'webkitAnimationEnd',
      msTransition: 'msAnimationEnd',
      OTransition: 'oanimationend',
    };

    for (a in animations) {
      if (el.style[a] !== undefined) {
        return animations[a];
      }
    }
  }),

  getStyle: function(element, propertyName) {
    if (window.getComputedStyle) {
      return document.defaultView
        .getComputedStyle(element, null)
        .getPropertyValue(propertyName);
    }

    return element.currentStyle[propertyName];
  },

  hasClass: function(element, className) {
    if (element.classList) {
      return element.classList.contains(className);
    }

    return !!element.className.match(
      new RegExp('(\\s|^)' + className + '(\\s|$)'),
    );
  },

  addClass: function(element, className) {
    if (element.classList) {
      element.classList.add(className);
      return;
    }

    if (!this.hasClass(element, className)) {
      element.className += ' ' + className;
    }
  },

  removeClass: function(element, className) {
    if (element.classList) {
      element.classList.remove(className);
      return;
    }

    if (this.hasClass(element, className)) {
      const reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
      element.className = element.className.replace(reg, ' ');
    }
  },

  addAttribute: function(element, attributeName, attributeValue) {
    element.setAttribute(attributeName, attributeValue);
  },

  removeAttribute: function(element, attributeName) {
    if (element.hasAttribute(attributeName)) {
      element.removeAttribute(attributeName);
    }
  },
});
