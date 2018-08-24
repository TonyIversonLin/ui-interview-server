var fs = require('fs');
var express = require('express');
var serveStatic = require('serve-static');
var path = require('path');
var morgan = require('morgan');
var healthChecker = require('sc-framework-health-check');

var mockDataFeed = require('./sc_modules/livemockdata');

module.exports.run = function (worker) {
  console.log('   >> Worker PID:', process.pid);
  var environment = worker.options.environment;

  var app = express();

  var httpServer = worker.httpServer;
  var scServer = worker.scServer;

  if (environment == 'dev') {
    // Log every HTTP request. See https://github.com/expressjs/morgan for other
    // available formats.
    app.use(morgan('dev'));
  }
  app.use(serveStatic(path.resolve(__dirname, 'public')));

  // Add GET /health-check express route
  healthChecker.attach(worker, app);

  httpServer.on('request', app);

  var count = 0;

  /*
    In here we handle our incoming realtime connections and listen for events.
  */
  scServer.on('connection', function (socket) {

      let interval = mockDataFeed.attach(scServer, socket); 
      
      socket.on('disconnect', () => {
        mockDataFeed.unsubscribe(interval);
      });
  });
};
