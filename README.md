form-data-parser
================

Middleware for connect or express that parses FormData in a sane way, no streams necessary.

_Note: Originally made to work with the [ember-cli-form-data](https://github.com/funtusov/ember-cli-form-data/) addon._

[![Build Status][travis-badge]][travis-badge-url]
[![Coverage Status][coveralls-badge]][coveralls-badge-url]

## Usage

```no-highlight
npm install form-data-parser --save
```

```js
var express = require('express');
var formDataParser = require('form-data-parser');

var app = express();
var fdp = formDataParser({
  attrs: {
    comments: 'array',
    coverPhoto: 'dataUri'
  }
});

/**
 * Sent
 * {
 *   blogPost: {
 *     comments: [1, 2],
 *     coverPhoto: formDataFile
 *   }
 * }
*/
app.post('/api/blog-post', fdp, function (req, res) {
  // req.body => { blogPost: comments: [1, 2], coverPhoto: 'data: image/png; base64, dasfe254....' }
});
```

[travis-badge]: https://travis-ci.org/knownasilya/form-data-parser.svg?branch=master
[travis-badge-url]: https://travis-ci.org/knownasilya/form-data-parser
[coveralls-badge]: https://coveralls.io/repos/knownasilya/form-data-parser/badge.svg?branch=master
[coveralls-badge-url]: https://coveralls.io/r/knownasilya/form-data-parser
