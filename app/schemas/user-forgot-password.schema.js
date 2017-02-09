var schema = {
  "type":"object",
  "$schema": "http://json-schema.org/draft-04/schema#",
  "properties":{
    "email":{
      "type": "string",
      "pattern": "^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"
    }
  },
  "additionalProperties": false,
  "required": ["email"]
};

module.exports = {
  name: 'userForgotPass',
  schema: schema
}
