'use strict';

var request = require('request'),
    jwt = require('jsonwebtoken'),
    async = require('async'),
    crypto = require('crypto'),
    handleError = require('../../../utils/handle-error'),
    _ = require('lodash'),
    User = require('../models/user.models');

var secret = '(C)loud(N)ote!';

exports.signup = function (req, res) {
    var valid = GLOBAL.ajv.validate('userSignup', req.body);
    if (!valid) {
        return res.status(400).json({
            message: 'Missing required parameters'
        });
    }

    User.create(req.body, function (err, user) {
        if (err && err.code === 11000) {
            return res.status(409).json({
                message: 'User already exists'
            });
        } else if (err) {
            return res.status(500).json(err.name);
        }

        var tokenObj = {
            name: user.name,
            lastname: user.lastname,
            id: user._id
        };

        user.token = jwt.sign(tokenObj, secret);
        user.save(function (err, user) {
            if (err) res.status(500).json(err.name);

            user = user.toObject();
            user = _.omit(user, ['password', '_id', '__v']);
            return res.status(201).json(user);
        })
    });
};

exports.login = function (req, res) {
    var valid = GLOBAL.ajv.validate('userLogin', req.body);
    if (!valid) {
        return res.status(400).json({
            message: 'Missing required parameters'
        });
    }

    if (!req.body.email) {
        res.status(400).json({
            message: 'E-mail required'
        });
        return;
    }

    if (!req.body.password) {
        res.status(400).json({
            message: 'Password required'
        });
        return;
    }

    User.findOne({
        email: req.body.email
    }, function (err, user) {
        if (err) {
            res.status(500).json({
                message: err.name
            });
            return;
        }
        if (!user) {
            res.status(404).json({
                message: 'Auth failed, try again'
            });
            return;
        }

        user.comparePassword(req.body.password, function (err, valid) {
            if (err) {
                res.status(500).json({
                    message: err.name
                });
                return;
            }

            var tokenObj = {
                name: user.name,
                lastname: user.lastname,
                id: user._id
            };

            user.token = jwt.sign(tokenObj, secret);
            user.save(function (err, user) {
                user = user.toObject();
                user = _.omit(user, ['password', '__v', '_id']);
                return res.status(201).json(user);
            })
        });
    });
};

exports.fbLogin = function (req, res) {
    var valid = GLOBAL.ajv.validate('userFbLogin', req.body);
    if (!valid) {
        return res.status(400).json({
            message: 'Missing required parameters'
        });
    }

    var AuthFB = 'https://graph.facebook.com/me?access_token=' + req.body.fbToken;
    request(AuthFB, function (err, res, body) {
        if (!err && response.statusCode == 200) {
            body = JSON.parse(body);
            if (body.id != req.body.fbId) {
                return res.status(401).json({
                    message: 'Failed auth with facebook.'
                });
            }

            createOrAuthFacebook(req, res, body);
        } else {
            return res.status(401).json({
                message: 'Failed auth with facebook.'
            });
        }
    })
};

exports.verify = function (req, res, next) {
    var token = req.headers['authtoken'];
    if (token) {
        jwt.verify(token, secret, function (err, decoded) {
            if (err) {
                return handleError.code401(res, 'Failed to auth token.');
            } else {
                if (!decoded.id && !decoded.fbId)
                    return handleError.code401(res, 'Failed to auth token.');

                var query = {};
                if (decoded.id) {
                    query = {_id: decoded.id, token: token};
                } else {
                    query = {fbId: decoded.fbId, token: token};
                }

                User.findOne(query, function (err2, user) {
                    if (err2) return handleError.code500(res);
                    if (!user) return handleError.code404(res, 'User not found');
                    user = user.toObject();
                    user = _.omit(user, ['password', 'token', '__v']);
                    req._user = user;
                    return next();
                });
            }
        })
    } else {
        return handleError.code401(res);
    }
};

exports.sendReset = function (req, res) {
    return res.status(200).json({
        message: 'In construction'
    })
};

function createOrAuthFacebook(req, res, fbData) {
    User.findOne({
        fbId: fbData.id
    }, function (err, user) {
        if (err) return res.status(500).json({
            message: err.name
        });

        if (!user) {
            var tokenObj = {
                name: req.body.name,
                lastname: req.body.lastname || '',
                fbId: req.body.fbId
            };

            var token = jwt.sign(tokenObj, secret);
            var userObj = req.body;
            userObj.token = token;

            User.create(userObj, function (err, user) {
                if (err) {
                    res.status(500).json({
                        message: err.name
                    });
                    return;
                }
                sendUser(req, res, user);
            });
        } else {
            var tokenObj = {
                name: user.name,
                lastname: user.lastname || '',
                fbId: user.fbId
            };

            var token = jwt.sign(tokenObj, secret);
            user.token = token;

            user.save(function (err, userAuth) {
                if (err) return res.status(500).json({
                    message: err.name
                });
                sendUser(req, res, user);
            })
        }
    })
}

function sendUser(req, res, user) {
    user = user.toObject();
    user = _.omit(user, ['password', '_id', '__v']);
    return res.status(200).json(user);
}