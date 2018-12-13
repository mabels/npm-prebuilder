"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var createHostnameLookup = function createHostnameLookup() {
  var map = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return function (req) {
    var hostname = req.hostname || req.host;

    if (!(hostname in map)) {
      return;
    }

    return map[hostname];
  };
};

exports.default = createHostnameLookup;