require('./src/db/mongoose');
const express = require('express');
const createError = require('http-errors');
const User = require('./src/models/user');
const Task = require('./src/models/task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/users', (req, res, next) => {
    const user = new User(req.body);
    user.save().then(() => {
        console.log(`user created ${user}`);
        res.status(201).send(`user created`);
    }).catch((error) => {
        console.log(`Error creating user ${error}`);
        // res.status(400).send(error);
        return next(createError(400, 'Failed to create user'));
    })
});

app.get('/users', (req, res) => {
    User.find({}).then((users) => {
        res.status(200).send(users);
    }).catch((error) => {
        res.status(500).send(error);
    })
});

app.get('/users/:id', (req, res) => {
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

app.post('/tasks', (req, res) => {
    const task = new Task(req.body);
    task.save().then(() => {
        console.log(`task created ${task}`);
        res.status(201).send(`task created`);
    }).catch((error) => {
        console.log(`Error creating task ${task}`);
        res.status(201).send(error);
    })
});

app.get('/tasks', (req, res) => {
    Task.find({}).then((tasks) => {
        res.status(200).send(tasks);
    }).catch((error) => {
        res.status(500).send(error);
    })
})

app.get('/tasks/:id', (req, res) => {
    const _id = req.params.id;
    Task.findById(_id).then((task) => {
        if (!task) {
            return res.status(404).send();
        }
        res.status(200).send(task);
    }).catch((error) => {
        res.status(500).send(error);
    })
})

app.listen(port, () => {
    console.log(`server started on port ${port}`);
})
