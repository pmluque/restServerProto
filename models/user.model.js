const { Schema, model } = require('mongoose');
const UserSchema = Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE'
    },
    google: {
        type: Boolean,
        required: false,
        default: false
    }
});

// Se usa function y no => porque this cogería del exterior
UserSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id; // para renombrar el id y además agregarlo nuevamente al object
    return object; // retorno object si versión y con id renombrado.
})

module.exports = model('User', UserSchema);