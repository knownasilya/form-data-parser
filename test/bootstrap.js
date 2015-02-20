'use strict';

var express = require('express');
var morgan = require('morgan');

module.exports = function (middleware) {
  var app = express();

  app.use(morgan('dev'));

  app.post('/', middleware, function (req, res) {
    res.json(req.body);
  });

  return app;
};
