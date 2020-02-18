const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const auth = require('../middleware/auth');

router.post('/tasks', auth, (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    task.save().then(() => {
        console.log(`task created ${task}`);
        res.status(201).send(`task created`);
    }).catch((error) => {
        console.log(`Error creating task ${task}`);
        res.status(201).send(error);
    })
});

router.get('/tasks', auth, async (req, res) => {
    try {
        await req.user.populate('tasks').execPopulate();
        res.status(200).send(req.user.tasks);
    } catch (error) {
        res.status(404).send(error);
    }
})

router.get('/tasks/:id', auth, (req, res) => {
    const _id = req.params.id;
    Task.findOne({ _id, owner: req.user._id }).then((task) => {
        if (!task) {
            return res.status(404).send();
        }
        res.status(200).send(task);
    }).catch((error) => {
        res.status(500).send(error);
    })
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowUpdates = ['description', 'completed'];
    const isValidOperator = updates.every((update) => allowUpdates.includes(update));

    if (!isValidOperator) {
        return res.status(400).send({ error: 'invalid operator' });
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        if (!task) {
            return res.status(404).send();
        }
        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();
        res.status(200).send(task);
    } 
    catch(error) {
        res.status(404).send(error);
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!task) {
            res.status(404).send();
        }
        res.status(200).send(task);
    } catch (error) {
        res.status(500).send();
    }
})

module.exports = router;