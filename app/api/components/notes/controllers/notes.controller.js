'use strict';

var Note = require('../models/note.models'),
    User = require('../../users/models/user.models'),
    handleError = require('../../../utils/handle-error'),
    _ = require('lodash');


exports.createNote = function (req, res) {
    var valid = GLOBAL.ajv.validate('noteCreate', req.body);
    if (!valid) {
        return res.status(400).json({
            message: 'Missing required parameters'
        });
    }

    User.findById(req._user._id, function (err, user) {
        if (err) return handleError.code500(res, err);
        if (!user) return handleError.code404(res, 'User not found');

        Note.create(req.body, function (err2, note) {
            if (err2)
                return res.status(400).json({
                    message: err2.name
                });

            user._notes.push(note._id);
            user.save(function (err3, userUpdated) {
                if (err3) return handleError.code500(res, err3);
                note = note.toObject();
                note = _.omit(note, ['idUser', '__v']);
                return res.json(note);
            });

        });
    });
};

exports.getNotes = function (req, res) {
    var query = User.findById(req._user._id).populate('_notes');
    query.exec(function (err, user) {
        if (err) return handleErr.code500(res, err.name);
        if (!user) return handleErr.code404(res, 'User not found');

        var notes = user.toObject()._notes;
        notes = _.map(notes, function (v) {
            v = _.omit(v, ['idUser', '__v']);
            return v;
        });
        return res.json(notes);
    });
};

exports.updateNote = function (req, res) {
    console.log(req);
    var query = Note.findById(req.params.id);
    query.exec(function (err, note) {
        if (err) return handleError.code500(res, err.name);
        if (!note) return handleError.code404(res, 'Note not found');

        note.message = req.body.message;
        note.save(function (err, note) {
            if (err)
                return handleError.code500(res, err.name);

            res.json({
                message: 'Note updated successfully',
                note: note
            });
        });
    });
};

exports.deleteNote = function (req, res) {
    var query = Note.findById(req.params.id);
    query.exec(function (err, note) {
        if (err) return handleError.code500(res, err.name);
        if (!note) return handleError.code404(res, 'Note not found');

        var noteRemoved = note;
        note.remove(function (err) {
            if (err) {
                res.status(400).json({
                    message: err.name
                })
            } else {
                res.json({
                    message: 'Note removed successfully',
                    note: noteRemoved
                })
            }
        });
    })
};