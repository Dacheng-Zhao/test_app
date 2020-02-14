const validator =  require('validator');
const mongoose = require('mongoose');

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error(`email format not correct`);
            }
        }
    },  
    age: {
        type: Number,
        default: 999,
        validate(value) {
            if (value < 0) {
                throw new Error(`age must be positive`);
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.includes('password')) {
                throw new Error(`Password can not contain "password"`);
            }
        }
    }
});

module.exports = User;