'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var createAcceptLanguageLookup = function createAcceptLanguageLookup() {
  return function (req) {
    var locales = void 0;

    if ('acceptsLanguages' in req) {
      locales = req.acceptsLanguages();
    } else if ('acceptedLanguages' in req) {
      locales = req.acceptedLanguages;
    }

    if (!Array.isArray(locales)) {
      return;
    }

    if (locales.length <= 0) {
      return;
    }

    return locales;
  };
};

exports.default = createAcceptLanguageLookup;