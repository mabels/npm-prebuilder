'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('../../utils');

exports.default = value => (0, _utils.equals)([], value) || (0, _utils.equals)('', value) || (0, _utils.equals)({}, value);