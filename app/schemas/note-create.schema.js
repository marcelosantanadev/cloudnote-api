var schema = {
    "type": "object",
    "$schema": "http://json-schema.org/draft-04/schema#",
    "properties": {
        "message": {
            "type": "string"
        }
    },
    "additionalProperties": false,
    "required": ["message"]
};

module.exports = {
    name: 'noteCreate',
    schema: schema
};
