'use strict';
var _ = require('lodash');
var FCM = require('fcm-node');
var config = require('../../../config/config');

module.exports = function (data, callback) {
    var serverkey = config.firebaseK;
    var fcm = new FCM(serverkey);

    var message = {
        to: data.user.fcmToken,
        collapse_key: '',
        notifications: {
            title: data.title,
            body: data.body
        }
    };

    if (!data.user.fcmToken) {
        console.log('FCM - User doesn\'t have any token');
        return callback('', null);
    }

    fcm.send(message, function (err, response) {
        if (err) {
            console.log('FCM - Something has gone wrong!', err);
            data.user.fcmToken = '';
            data.user.save(function (err2, user) {
                callback(err, null);
            });
        } else {
            console.log('FCM - Successfully sent with response: ', response);
            callback(null, response);
        }
    })
};