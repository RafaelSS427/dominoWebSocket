"use strict";

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _http = _interopRequireDefault(require("http"));

var _socket = _interopRequireDefault(require("socket.io"));

var _sockets = _interopRequireDefault(require("./sockets"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//import socket connection
//init
var app = (0, _express["default"])();

var server = _http["default"].createServer(app);

var io = (0, _socket["default"])(server); //settings

app.set('port', process.env.PORT || 3000); //creando puerto
//sockets

(0, _sockets["default"])(io); // static files

app.use(_express["default"]["static"](_path["default"].join(__dirname, 'public'))); //starting server

server.listen(app.get('port'), function () {
  console.log('Server in port', app.get('port'));
});