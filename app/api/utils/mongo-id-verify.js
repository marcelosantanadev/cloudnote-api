'use strict';
var _ = require('lodash');
var mongoose = require('mongoose');

module.exports = function(id) {
    function verifyId (id) {
        return mongoose.Types.ObjectId.isValid(id);
    }

    if (_.isArray(id)) {
        var valid = false;
        _.forEach(id, function(v) {
            valid = verifyId(v);
            return valid;
        });
        return valid;
    } else {
        return verifyId(id);
    }
};
