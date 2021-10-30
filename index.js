const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express()
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3bc4k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('database connected now');
        const database = client.db('travelBooking');
        const packagesCollection = database.collection('packages');

        //Get APi
        app.get('/packages', async (req, res) => {
            const cursor = packagesCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        });

        //get singlePackage
        app.get('/packages/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific package', id);
            const query = { _id: ObjectId(id) };
            const singlePackage = await packagesCollection.findOne(query);
            res.json(singlePackage);
        })


        //post API
        app.post('/packages', async (req, res) => {
            const package = req.body;
            console.log('hit the post api', package);

            const result = await packagesCollection.insertOne(package);
            console.log(result);
            res.json(result);
        })

        //DELETE API
        app.delete('/packages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await packagesCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('welcome to travel world!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})