'use strict';

var path = require('path');
var test = require('tape');
var request = require('supertest');
var lib = require('../');
var bootstrap = require('./bootstrap');

test('Ok', function (t) {
  var app = bootstrap(lib({
    attrs: {
      isUser: 'boolean'
    }
  }));

  request(app)
    .post('/')
    .field('test[name]', 'Tobi')
    .field('test[isUser]', 'true')
    .attach('test[image]', path.join(__dirname, 'assets/images/test_png.png'))
    .type('form')
    .expect(200)
    .end(function (err, res) {
      t.error(err, 'No error');
      t.same(res.body, { test: { isUser: true, name: 'Tobi' } }, 'Body correct');
      t.end();
    });
});
