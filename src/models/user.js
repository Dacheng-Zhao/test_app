const validator =  require('validator');
const mongoose = require('mongoose');
const bycrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
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
})

userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bycrypt.hash(user.password, 8);
    }
    next()
})

const User = mongoose.model('User', userSchema);

module.exports = User;