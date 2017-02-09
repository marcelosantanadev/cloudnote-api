var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('lodash');

var NoteSchema = new Schema({
    message: {
        type: String,
        require: true
    },
    dateCreated: {
        type: Date,
        default: Date.now,
        required: true
    },
    isTrash: {
        type: Boolean,
        default: false
    },
    trashExpires: {
        type: Date
    }
});

module.exports = mongoose.model('Note', NoteSchema);
