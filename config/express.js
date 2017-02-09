'use strict';

var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    config = require('./config'),
    path = require('path'),
    cors = require('cors'),
    _ = require('lodash');

module.exports = function (db) {
    var app = express();

    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Client-Type");

        next();
    });


    app.set('showStackError', true);
    app.use(morgan('dev'));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(cors());

    app.set('views', './views');
    app.set('view engine', 'ejs');
    app.use('/public', express.static('./public'));

    // ==============================
    // Load and config Global scripts
    // ==============================
    var Ajv = require('ajv');
    var ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
    GLOBAL.ajv = ajv;
    GLOBAL.memory = function () {
        var memory = {};

        return {
            set: function (key, value) {
                return memory[key] = value;
            },
            get: function (key) {
                return memory[key];
            }
        };
    }();

    app.get('/', function (req, res) {
        return res.redirect('https://github.com/marcelosantanadev');
    });
    // ==============================
    // Config API
    // ==============================
    require(path.resolve('./app/schemas'));

    config.getGlobbedFiles('./app/api/components/*/models/*.js').forEach(function (modelPath) {
        require(path.resolve(modelPath));
    });

    var api = express.Router();
    require(path.resolve('./app/api/components/users/routes/auth.routes'))(api);

    var authenticate = require(path.resolve('./app/api/components/users/controllers/auth.controller'));
    api.use(authenticate.verify);


    config.getGlobbedFiles('./app/api/components/*/routes/*.js').forEach(function (routePath) {
        require(path.resolve(routePath))(api);
    });

    app.use('/api', api);
    app.use(function (err, req, res, next) {
        if (!err) return next();

        console.error(err.stack);

        res.status(500).json({
            error: err.name
        });
    });

    app.use(function (req, res) {
        res.status(404).json({
            url: req.originalUrl,
            error: 'Not Found'
        });
    });

    return app;
};
