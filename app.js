require('./src/db/mongoose');
const express = require('express');
const createError = require('http-errors');
const User = require('./src/models/user');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/users', (req, res, next) => {
    const user = new User(req.body);
    user.save().then(() => {
        console.log(`user created ${user}`);
        res.send(`user created`);
    }).catch((error) => {
        console.log(`Error creating user ${error}`);
        // res.status(400).send(error);
        return next(createError(400, 'Failed to create user'));
    })
});

app.listen(port, () => {
    console.log(`server started on port ${port}`);
})
