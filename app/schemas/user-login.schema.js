var schema = {
  "type":"object",
  "$schema": "http://json-schema.org/draft-04/schema#",
  "properties":{
    "email":{
      "type": "string",
      "pattern": "^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"
    },
    "password":{
      "type": "string",
      "minLength": 6,
      "maxLength": 12
    }
  },
  "additionalProperties": false,
  "required": ["email", "password"]
};

module.exports = {
  name: 'userLogin',
  schema: schema
}
