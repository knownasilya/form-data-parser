'use strict';

var path = require('path');
var test = require('tape');
var request = require('supertest');
var lib = require('../');
var bootstrap = require('./bootstrap');

test('Ok', function (t) {
  var app = bootstrap(lib({
    attrs: {
      isUser: 'boolean',
      image: 'dataUri',
      age: 'number',
      items: 'array'
    }
  }));

  request(app)
    .post('/')
    .field('test[name]', 'Tobi')
    .field('test[isUser]', 'true')
    .field('test[age]', '20')
    .field('test[items]', 'backpack,phone,hat')
    .attach('test[image]', path.join(__dirname, 'assets/images/test_png.png'))
    .type('form')
    .expect(200)
    .end(function (err, res) {
      t.error(err, 'No error');
      t.same(res.body, {
        test: {
          isUser: true,
          name: 'Tobi',
          age: 20,
          items: ['backpack', 'phone', 'hat'],
          image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAAAXNSR0IArs4c6QAAAURJREFUKBV9UktqhEAQ9RMRBz879QIJBJcJQcRjzBVm5SW8hKtcYY4hIiFZipBcQN35SUSMmnoyQs8Mk15od9V7VV3vNc9drCiKHpdleeB5/on+H/T/DIIgZ2H8dgjD8M627VdBEPaapk26ritN0/Rt24rzPB+LoggI8wP8SqLDzrKsb1mWJ9d1RSJutTgicHme91VVKWVZSoT9XbPUITJNs/c874wAJgo4jqOgIG6CGI8ZJEl6831fZTsgyS50jOO4G8fxRaBB71VVnf4jgIw8ZoVIAn2eDcNQ2Kq39hAHqqLTe13X/S0gG4easAGdvrqug6xs/mqPPOSHbwKMo8AxTdPpCskEIDtwwK+Sk3GHYRjELMuQYKDc6lOSJBN8gsFIsi9iB79IpT3UhDiY9XR1vIgDjD0jbeXhG2yAqhAJM1++vT94DrZKppaKPgAAAABJRU5ErkJggg=='
        }
      }, 'Body correct');
      t.end();
    });
});
