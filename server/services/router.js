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
  var files = this._getFiles(directory),
    _this = this;

  _.each(files, function(fileName) {
    _this._defineStatic(directory, fileName);
  });
};

// walk rootDirectory, finding all files
// uses simple file regex, assuming all files have file extensions
// to improve this logic could use: fs.stat(path, callback(err, stats)) -> stats.isDirectory()
Router._getFiles = function(rootDirectory, nestedDir, fileList) {
  var directory = rootDirectory,
    _this = this;

  fileList = fileList || [];

  if(nestedDir) {
    directory = rootDirectory + '/' + nestedDir;
  }

  var files = fs.readdirSync(directory);

  _.each(files, function(fileName) {
    if(nestedDir) fileName = nestedDir + '/' + fileName;

    // if current item is a directory, recursively search directory
    if(!_.contains(fileName, '.')) {
      _this._getFiles(rootDirectory, fileName, fileList);

    } else {
      fileList.push(fileName);
    }
  });

  return fileList;
};

Router._defineStatic = function(directory, fileName) {
  var filePath = directory + '/' + fileName,
    _this = this;

  this.on('GET', '/' + fileName, function(req, res) {
    _this._readFileAndRespond(filePath, res);
  });
};

Router._readFileAndRespond = function(filePath, res) {
  var contentType = this._getContentType(filePath);

  res.writeHead(200, {'Content-Type': contentType});

  fs.readFile(filePath, function(err, data) {
    if(err) throw new Error('Error reading static file:', filePath);
    res.end(data);
  });
};

Router._getContentType = function(filePath) {
  var extension = _.last(filePath.split('.'));
  return this._contentTypes[extension];
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
    if(!action) throw new Error('Need to define unkown route handling.');
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
