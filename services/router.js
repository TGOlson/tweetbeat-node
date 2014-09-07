// Third party libraries
var url = require('url'),
  fs = require('fs'),
  _ = require('lodash');

var Router = {
  routes: {
    GET: {},
    // POST, PUT and DELETE not currently used by app
  },
  _contentTypes: {
    html: 'text/html',
    js: 'application/javascript',
    css: 'text/css'
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

Router.static = function(directory) {
  var _this = this;

  fs.readdir(directory, function(err, files) {
    _.each(files, function(fileName) {
      _this._defineStatic(directory, fileName);
    });
  });
};

Router._defineStatic = function(directory, fileName) {
  var _this = this;

  this.on('GET', '/' + fileName, function(req, res) {
    var filePath = directory + '/' + fileName;
    _this._readFileAndRespond(filePath, res);
  });
};

Router._readFileAndRespond = function(filePath, res) {
  var extension = _.last(filePath.split('.')),
    contentType = this._contentTypes[extension];

  res.writeHead(200, {'Content-Type': contentType});

  fs.readFile(filePath, function(err, data) {
    if(err) throw new Error('Error reading static file:', filePath);
    res.end(data);
  });
};

Router.route = function(req, res) {
  var method = req.method,
    methodActions = this.routes[method];

  if(!methodActions) throw new Error('Unknown request method.');

  // second arg of true will parse query string to object
  var urlParts = url.parse(req.url, true),
    pathname = urlParts.pathname,
    action = methodActions[pathname];

  if(!action) {

    // if route is not registered, try to fall back to default
    action = this.default;

    // if no default is defined, throw an error
    // this may need to be handled differently in production
    if(!action) throw new Error('Unknown route.');
  }

  // if action is defined as a string, then forward request to correct action
  if(typeof action === 'string') {
    action = methodActions[action];
  }

  // add helpful parsed properties to request
  req.query = urlParts.query;

  action(req, res);
};

module.exports = Router;
