import Service from '@ember/service';

export default Service.extend({
  sanitizeDigitsOnly: function(string) {
    if (string) {
      return string.replace(/[^\d]/g, '');
    }
  },

  validateEmailSyntax: function(string) {
    const EMAIL = /^(?:.+)(?:@)(?:.+)(?:\.)(?:.+)$/gm;

    if (string.search(EMAIL) !== -1) {
      return true;
    }

    return false;
  }
});
