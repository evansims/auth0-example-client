import Service from '@ember/service';

export default Service.extend({
  closest: function(elem, selector) {
    if (!Element.prototype.matches) {
      Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function(s) {
          var matches = (this.document || this.ownerDocument).querySelectorAll(
              s
            ),
            i = matches.length;
          while (--i >= 0 && matches.item(i) !== this) {
            //
          }
          return i > -1;
        };
    }

    for (; elem && elem !== document; elem = elem.parentNode) {
      if (elem.matches(selector)) {
        return elem;
      }
    }

    return null;
  },

  parents: function(elem, selector) {
    if (!Element.prototype.matches) {
      Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function(s) {
          var matches = (this.document || this.ownerDocument).querySelectorAll(
              s
            ),
            i = matches.length;
          while (--i >= 0 && matches.item(i) !== this) {
            //
          }
          return i > -1;
        };
    }

    var parents = [];

    for (; elem && elem !== document; elem = elem.parentNode) {
      if (selector) {
        if (elem.matches(selector)) {
          parents.push(elem);
        }
      } else {
        parents.push(elem);
      }
    }

    return parents;
  }
});
