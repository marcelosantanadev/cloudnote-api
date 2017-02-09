var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    Schema = mongoose.Schema,
    _ = require('lodash');

var UserSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    lastname: {
        type: String,
        require: true
    },
    password: {
        type: String
    },
    email: {
        type: String,
        index: {
            unique: true
        }
    },
    phone: Number,
    token: {
        type: String,
        require: true
    },
    fbId: {
        type: String
    },
    _notes: [{ type: Schema.Types.ObjectId, ref: 'Note' }],
    fcmToken: String,
    dateCreated: {
        type: Date,
        default: Date.now,
        required: true
    },

});

UserSchema.index({'email': 1});

UserSchema.pre('save', function (next) {
    var user = this;

    if ((this.isNew && _.isEmpty(user.fbId)) || this.isModified('password')) {
        bcrypt.hash(user.password, 10, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            return next(null);
        });

    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function(passw, cb) {
    bcrypt.compare(passw, this.password, function(err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

function hashPass (password, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            return callback(err);
        }
        bcrypt.hash(password, salt, function(err, hash) {
            if (err) {
                return callback(err);
            }
            return callback(null, hash);
        });
    });
}

module.exports = mongoose.model('User', UserSchema);
