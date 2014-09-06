// Third party libraries
var url = require('url');

var Router = {
  definitions: {
    get: {},
    post: {},
    put: {},
    delete: {}
  },
  default: null
};

Router.get = function(route, callback) {
  this.definitions.get[route] = callback;
  return this;
};

// post, put and delete not currently required

Router.onUnknown = function(callback) {
  this.default = callback;
};

Router.forward = function(req, res) {
  var urlParts = url.parse(req.url, true),
    pathName = urlParts.pathname,
    query = urlParts.query,

    method = req.method.toLowerCase(),
    actionSet = this.definitions[method];

  if(!actionSet) throw new Error('Unknown request method.');

  var action = actionSet[pathName];

  if(!action) {
    action = this.default;
    if(!action) throw new Error('Unknown route.');
  }

  // add helpful parsed properties back to request
  req.query = query;

  action(req, res);
};

module.exports = Router;
