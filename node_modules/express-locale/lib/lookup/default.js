'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var createDefaultLookup = function createDefaultLookup() {
  var locale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'en_GB';

  var invalidLocaleError = new Error('A valid locale is required for default lookup');

  if (typeof locale !== 'string') {
    throw invalidLocaleError;
  }

  locale = locale.trim();

  if (locale.length !== 5) {
    throw invalidLocaleError;
  }

  return function () {
    return locale;
  };
};

exports.default = createDefaultLookup;