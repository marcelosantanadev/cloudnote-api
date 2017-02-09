'use strict';

module.exports = function (api) {
    var notes = require('../controllers/notes.controller');
    api.route('/notes')
        .post(notes.createNote)
        .get(notes.getNotes);

    api.route('/notes/:id')
        .put(notes.updateNote)
        .delete(notes.deleteNote);
};