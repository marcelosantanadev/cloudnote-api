'use strict';
var path = require('path');
var config = require(path.resolve(__dirname, '../../config/config.js'));

config.getGlobbedFiles('./app/schemas/*.schema.js').forEach(function(schemaPath) {
  var schema = require(path.resolve(schemaPath));
  GLOBAL.ajv.addSchema(schema.schema, schema.name);
});
