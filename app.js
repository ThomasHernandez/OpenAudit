var express = require('express');
var config = require('./config/config');
var glob = require('glob');
var mongoose = require('mongoose');

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});
var app = express(); 
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var realtime = require('./app/realtime/realtime.js')
realtime.setup(io);

require('./config/express')(app, config);

server.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});

