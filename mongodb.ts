require('dotenv').config();
const {MongoClient} = require('mongodb');
const url=process.env.MONGO_URI;
const client = new MongoClient(url);
const dbName = 'testing';
async function main() {
    await client.connect()
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('user');
    return 'done.';
}
main().then(console.log)
.catch(console.error)
.finally(() => client.close());