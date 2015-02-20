'use strict';

var fs = require('fs');
var multiparty = require('multiparty');

/**
 * Options
 * - root: (string) type of model, singular or plural
 * - attrs: (obj) name to type
 */
module.exports = function (options) {
  return function (req, res, next) {
    var form = new multiparty.Form();

    form.parse(req, function(err, fields, files) {
      if (!fields || !files) {
        return next('Request is probably not FormData');
      }

      var fieldKeys = Object.keys(fields);
      var fileKeys = Object.keys(files);

      if (!req.body) {
        req.body = {};
      }

      fieldKeys.forEach(function (fieldKey) {
        var match = fieldKey.match(/(\w+)\[(\w+)\]$/);
        var type = options.attrs[match[2]];
        var root = match[1];
        var outputAttr = type && type.outputAttr ? type.outputAttr : match[2];

        if (!req.body[root]) {
          req.body[root] = {};
        }

        req.body[root][outputAttr] = coerceAttr(fields[fieldKey], type);
      });

      fileKeys.forEach(function (fileKey) {
        var match = fileKey.match(/(\w+)\[(\w+)\]$/);
        var file = files[fileKey][0];
        var type = options.attrs[match[2]];
        var root = match[1];
        var outputAttr = type && type.outputAttr ? type.outputAttr : match[2];

        if (!req.body[root]) {
          req.body[root] = {};
        }

        req.body[root][outputAttr] = coerceAttr(file, type);
      });

      next();
    });
  };
};

function coerceAttr(attr, typeData) {
  var type = typeof typeData === 'object' ? typeData.type : typeData;

  attr = Array.isArray(attr) ? attr[0] : attr;

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
