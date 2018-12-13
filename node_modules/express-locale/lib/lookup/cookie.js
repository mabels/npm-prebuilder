'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var createCookieLookup = function createCookieLookup() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$name = _ref.name,
      name = _ref$name === undefined ? 'locale' : _ref$name;

  var noNameError = new Error('A cookie name is required for cookie locale lookup');

  if (typeof name !== 'string' || name.trim().length <= 0) {
    throw noNameError;
  }

  return function (req) {
    if (!('cookies' in req)) {
      return;
    }

    if (!(name in req.cookies)) {
      return;
    }

    return req.cookies[name];
  };
};

exports.default = createCookieLookup;