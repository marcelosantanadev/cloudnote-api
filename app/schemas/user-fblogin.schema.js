var schema = {
  "type":"object",
  "$schema": "http://json-schema.org/draft-04/schema#",
  "properties":{
    "fbToken":{
      "type": "string"
    },
    "fbId":{
      "type": "string"
    },
    "name":{
      "type": "string"
    },
    "lastname":{
      "type": "string"
    },
    "email":{
      "type": "string",
      "pattern": "^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"
    }
  },
  "additionalProperties": false,
  "required": ["fbToken", "fbId", "name"]
};

module.exports = {
  name: 'userFbLogin',
  schema: schema
}
