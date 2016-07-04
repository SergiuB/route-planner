require('babel-register')();

global.google = {
  maps: {
    Point: function Point() {},
  },
};
