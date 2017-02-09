var schema = {
  "type":"object",
  "$schema": "http://json-schema.org/draft-04/schema#",
  "properties":{
    "name":{
      "type": "string"
    },
    "lastname":{
      "type": "string"
    },
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
  "required": ["name", "lastname", "email", "password"]
};

module.exports = {
  name: 'userSignup',
  schema: schema
};
