const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 4000;



// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g3sna.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db('tourist');
      const serviceCollection = database.collection('service');

        // CREAT SERVICE API
        app.get('/services', async (req,res)=>{
            const cursor = serviceCollection.find({});
            const result = await cursor.toArray();
            // console.log(result)
            res.send(result);
        });
        // CREATE SINGLE DETAIL API
        app.get('/services/:id', async (req,res)=>{
            const id = req.params.id;
            // console.log('getting', id);
            const service = {_id : ObjectId(id)};
            const result = await serviceCollection.findOne(service);
            // console.log(result)
            res.send(result);
        })
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req,res)=>{
    res.send('Connected Successfully')
});

app.listen(port, ()=>{
    console.log('Listenning to the port', port)
});