require('./src/db/mongoose');
const express = require('express');
const createError = require('http-errors');
const userRouter = require('./src/routers/user');
const taskRouter = require('./src/routers/task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log(`server started on port ${port}`);
})
