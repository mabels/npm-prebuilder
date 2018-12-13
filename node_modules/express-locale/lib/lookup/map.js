"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var createMapLookup = function createMapLookup() {
  var map = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return function (req, locales) {
    return locales.filter(function (locale) {
      return !locale.region && locale.language in map;
    }).map(function (locale) {
      return map[locale.language];
    });
  };
};

exports.default = createMapLookup;