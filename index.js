'use strict';

var fs = require('fs');
var multiparty = require('multiparty');

/**
 * Options (optional)
 * - attrs: (obj) name to type
 */
module.exports = function (options) {
  return function (req, res, next) {
    var form = new multiparty.Form();

    form.parse(req, function(err, fields, files) {
      var fieldKeys = Object.keys(fields);
      var fileKeys = Object.keys(files);

      fieldKeys.forEach(function (fieldKey) {
        var match = fieldKey.match(/(\w+)\[(\w+)\]$/);
        var type = options.attrs[match[2]];
        var root = match[1];

        if (!req.body[root]) {
          req.body[root] = {};
        }

        req.body[root][match[2]] = coerceAttr(fields[fieldKey], type);
      });

      fileKeys.forEach(function (fileKey) {
        var match = fileKey.match(/(\w+)\[(\w+)\]$/);
        var file = files[fileKey][0];
        var type = options.attrs[match[2]];
        var root = match[1];

        if (!req.body[root]) {
          req.body[root] = {};
        }

        req.body[root][type.outputAttr || match[2]] = coerceAttr(file, type);
      });

      next();
    });
  };
};

function coerceAttr(attr, typeData) {
  var type = typeof typeData === 'object' ? type.type : type;

  attr = attr[0];

  if (!attr) {
    return attr;
  }

  switch(type) {
    case 'array': {
      return attr.split(',');
    }

    case 'boolean': {
      return Boolean(attr);
    }

    case 'number': {
      return Number(attr);
    }

    case 'dataUri': {
      var data = fs.readFileSync(attr.path);

      return 'data:' +
        attr.headers['content-type'] + ';base64,' +
        data.toString('base64');
    }

    default: {
      return attr;
    }
  }
}
