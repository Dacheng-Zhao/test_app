require('dotenv').config();
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

MongoClient.connect(process.env.DB_URL, (error, client) => {
    if (error) {
        return console.log(`connect error`);
    }

    console.log(`connect success`);

    const db = client.db(process.env.DB_NAME);
    const user = {
        name: 'Dacheng',
        age: 28
    };
    db.collection('users').insertOne(user, (error, result) => {
        if (error) {
            return console.log(`${error}`);
        }
        console.log(result.ops);
    });
})
