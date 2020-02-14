require('dotenv').config();
const mongoose = require('mongoose');

const newUrl = process.env.DB_URL + '/' + process.env.DB_NAME2;
console.log(`Connect to mongoDB ${newUrl}`);
mongoose.connect(newUrl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
