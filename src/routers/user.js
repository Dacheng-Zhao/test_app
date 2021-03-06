const express = require('express');
const auth = require('../middleware/auth');
const router = new express.Router();
const User = require('../models/user'); 

router.post('/users', async (req, res, next) => {
    const user = new User(req.body);
    // user.save().then(() => {
    //     console.log(`user created ${user}`);
    //     res.status(201).send(`user created`);
    // }).catch((error) => {
    //     console.log(`Error creating user ${error}`);
    //     // res.status(400).send(error);
    //     return next(createError(400, 'Failed to create user'));
    // })
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/users/me', auth, async (req, res) => {
    res.status(200).send(req.user);
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            token.token != req.token;
        })
        await req.user.save();
        res.status(200).send(req.user);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/users/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.status(200).send(req.user);
    } catch (error) {
        res.status(500).send(error);
    }
})

router.get('/users', (req, res) => {
    User.find({}).then((users) => {
        res.status(200).send(users);
    }).catch((error) => {
        res.status(500).send(error);
    })
});

router.get('/users/:id', auth, (req, res) => {
    const _id = req.params.id;
    User.findById(_id).then((user) => {
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send(user);
    }).catch((error) => {
        res.status(500).send(error);
    })
})

router.patch('/users/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperator = updates.every((update) => allowUpdates.includes(update));

    if (!isValidOperator) {
        return res.status(400).send({ error: 'invalid attributes' });
    }

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        updates.forEach((update) => {
            user[update] = req.body[update];
        })
        await user.save();
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
})

router.delete('/users/:id', auth, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send(user);
    }
    catch (error) {
        res.status(500).send(error);
    }
})

router.delete('/user/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        res.status(200).send(req.user);
    } catch(error) {
        res.status(500).send(error);
    }
})

router.post('/user/login', async (req, res) => {
    try {
        const user = await User.findByCredential(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.status(200).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
})

module.exports = router;