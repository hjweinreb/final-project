const fs = require('file-system');
const { MongoClient } = require('mongodb');
const assert = require('assert');

const resources1 = JSON.parse(fs.readFileSync('data/testData.json'));

const batchImport = async () => {
    console.log("here are greetings", resources1);

    const uri = "mongodb+srv://dbAdmin:lizard882@cluster0-1tqzq.mongodb.net/test?retryWrites=true&w=majority";
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    // open the connection to the database server
    await client.connect();
    console.log('connected!');

    const db = client.db('finalproject');

    const r = await db.collection('resources-first').insertMany(resources1);
    assert.equal(resources1.length, r.insertedCount);

    // close the connection to the database server
    client.close();
    console.log('disconnected!');

}


batchImport();
