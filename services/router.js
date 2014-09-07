// Third party libraries
var url = require('url');

var Router = {
  routes: {
    GET: {},
    // POST, PUT and DELETE not currently used by app
  },
  default: null
};

Router.on = function(method, route, callback) {
  var methodActions = this.routes[method];

  if(!methodActions) throw new Error('Unknown request method when registering route.');

  methodActions[route] = callback;
};


Router.onUnknown = function(callback) {
  this.default = callback;
};

Router.route = function(req, res) {
  var method = req.method,
    methodActions = this.routes[method];

  if(!methodActions) throw new Error('Unknown request method.');

  // second arg of true will parse query string to object
  var urlParts = url.parse(req.url, true),
    pathName = urlParts.pathname,
    action = methodActions[pathName];

  if(!action) {

    // if route is not registered, try to fall back to default
    action = this.default;

    // if no default is defined, throw an error
    // this may need to be handled differently in production
    if(!action) throw new Error('Unknown route.');
  }

  // add helpful parsed properties back to request
  req.query = urlParts.query;

  action(req, res);
};

module.exports = Router;
