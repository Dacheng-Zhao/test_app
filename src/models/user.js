const validator = require('validator');
const mongoose = require('mongoose');
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Task = require('./task');

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
        unique: true,
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
    },
    tokens: [
        {
            token:
            {
                type: String
            }
        }
    ]
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id.toString() }, 'secretKey');
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}

userSchema.methods.toJSON = function () {
    const user = this;
    const userObj = user.toObject();

    delete userObj.password;
    delete userObj.tokens;
    return userObj;
}

userSchema.statics.findByCredential = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error(`Unable to login, user not exist`);
    }
    const isMatch = await bycrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error(`Password does not match`);
    }
    return user
}

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bycrypt.hash(user.password, 8);
    }
    next()
})

userSchema.pre('remove', async function(next) {
    const user = this;
    await Task.deleteMany({ owner: user._id })
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;