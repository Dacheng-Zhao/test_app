require('./src/db/mongoose');
const express = require('express');
const createError = require('http-errors');
const User = require('./src/models/user');
const Task = require('./src/models/task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/users', async (req, res, next) => {
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
        res.status(201).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
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

app.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperator = updates.every((update) => allowUpdates.includes(update));

    if (!isValidOperator) {
        return res.status(400).send({ error: 'invalid attributes' });
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send();
    }
})

app.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            res.status(404).send();
        }
        res.status(200).send(user);
    }
    catch (error) {
        res.status(500).send(error);
    }
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

app.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowUpdates = ['description', 'completed'];
    const isValidOperator = updates.every((update) => allowUpdates.includes(update));

    if (!isValidOperator) {
        return res.status(400).send({ error: 'invalid operator' });
    }

    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!task) {
            return res.status(404).send();
        }
        res.status(200).send(task);
    } 
    catch(error) {
        res.status(404).send();
    }
})

app.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            res.status(404).send();
        }
        res.status(200).send(task);
    } catch (error) {
        res.status(500).send();
    }
})

app.listen(port, () => {
    console.log(`server started on port ${port}`);
})
