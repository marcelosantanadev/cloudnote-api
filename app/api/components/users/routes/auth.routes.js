'use strict';

module.exports = function (api) {
    var auth = require('../controllers/auth.controller');
    api.route('/user/login').post(auth.login);
    api.route('/user/fb-login').post(auth.fbLogin);
    api.route('/user/signup').post(auth.signup);
    api.route('/user/forgot-password').post(auth.sendReset);
};