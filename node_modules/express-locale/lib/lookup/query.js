'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var createQueryLookup = function createQueryLookup() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$name = _ref.name,
      name = _ref$name === undefined ? 'locale' : _ref$name;

  var noNameError = new Error('A query string parameter name is required for query string locale lookup');

  if (typeof name !== 'string' || name.trim().length <= 0) {
    throw noNameError;
  }

  return function (req) {
    if (!(name in req.query)) {
      return;
    }

    return req.query[name];
  };
};

exports.default = createQueryLookup;