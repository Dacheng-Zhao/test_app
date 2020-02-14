require('dotenv').config();
const mongoose = require('mongoose');

const newUrl = process.env.DB_URL + '/' + process.env.DB_NAME2;
console.log(newUrl);
mongoose.connect(newUrl, {
    useCreateIndex: true,
});

const User = mongoose.model('User', {
    name: {
        type: String
    },
    age: {
        type: Number
    }
});

const me = new User({
    name: 'Dacheng',
    age: 29
});

me.save().then(() => {
    console.log(me);
}).catch((error) => {
    console.log('Error!' + error);
});
