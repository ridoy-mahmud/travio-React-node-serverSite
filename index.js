const { MongoClient } = require('mongodb');
const express = require('express');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d7tq6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        //console.log('connect')
        const database = client.db("classic_Travel");
        const servicesCollection = database.collection("services");
        const orderCollection = database.collection("orders");

        //GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray()
            res.send(services);
        })

        // GET single item by id and display the user info
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await servicesCollection.findOne(query);
            res.json(service)
        })

        //POST API Add A Service
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            res.json(result);
        });



        //GET API Order
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({})
            const orders = await cursor.toArray()
            res.send(orders);
        })

        //POST Submit Order API
        app.post('/orders', async (req, res) => {
            const orders = req.body;
            const result = await orderCollection.insertOne(orders);
            res.json(result);
        });

        // GET single item by id and display the user info
        app.get('/orders/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const orders = await orderCollection.find(query);
            res.json(orders)
        })

        //Delete api
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        })

    }
    finally {
        //await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Run Time Travel')
})

app.listen(port, () => {
    console.log('Running The Server', port)
})