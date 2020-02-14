require('dotenv').config();
const mongoose = require('mongoose');

const newUrl = process.env.DB_URL + '/' + process.env.DB_NAME2;
console.log(`Connect to mongoDB ${newUrl}`);
mongoose.connect(newUrl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        trim: true,
    },
    completed: {
        type: Boolean
    }
});

const task = new Task({
    description: 'Complete the mongoose library',
    completed: false,
})
