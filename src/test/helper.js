require('babel-register')();
require('babel-polyfill');

global.google = {
  maps: {
    Point: function Point() {},
  },
};
