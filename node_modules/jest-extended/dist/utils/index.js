'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.equals = exports.determinePropertyMessage = exports.contains = undefined;

var _jasmine_utils = require('expect/build/jasmine_utils');

const contains = exports.contains = (list, value) => {
  return list.findIndex(item => (0, _jasmine_utils.equals)(item, value)) > -1;
};

const determinePropertyMessage = exports.determinePropertyMessage = (actual, property, message = 'Not Accessible') => {
  return actual && actual[property] ? actual[property] : message;
};

exports.equals = _jasmine_utils.equals;