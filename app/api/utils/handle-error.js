'use strict';

exports.code500 = function(res, msg) {
    msg = msg || "Internal server erro";
    return res.status(500).json({'message': msg});
}

exports.code400 = function(res, msg) {
    msg = msg || "Bad Request";
    return res.status(400).json({'message': msg});
}

exports.code401 = function(res, msg) {
    msg = msg || "Unauthorized";
    return res.status(401).json({'message': msg});
}

exports.code404 = function(res, msg) {
    msg = msg || "Not found";
    return res.status(404).json({'message': msg});
}
