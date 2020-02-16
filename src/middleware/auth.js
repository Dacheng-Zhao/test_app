const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bear ', '');
        const decode = jwt.verify(token, 'secretKey');
        const user = await User.findOne({ _id: decode._id, 'tokens.token': token });

        if (!user) {
            throw new Error(`no user found`);
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).send('Please authenticate')
    }
}

module.exports = auth;
