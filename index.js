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
      const OrderCollection = database.collection('Order');
      const informationCollection = database.collection('info');

        // CREAT SERVICE API
        app.get('/services', async (req,res)=>{
            const cursor = serviceCollection.find({});
            const result = await cursor.toArray();
            // console.log(result)
            res.send(result);
        });
        // DELETE SERVICES
        app.delete('/services/:id', async(req,res)=>{
          const id = req.params.id;
          const service = {_id : ObjectId(id)};
          const result = await OrderCollection.deleteOne(service)
          res.json(result)
        })
        // ADD SERVICE
        app.post('/services', async (req,res)=>{
            const addservice = req.body; 
            const result = await serviceCollection.insertOne(addservice)
            // console.log(result)
            res.json(result);
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
        app.get('/service/placeOrder/:id', async (req,res)=>{
          const id = req.params.id;
          console.log('get name',id)
          const service = {_id : ObjectId(id)};
          const result = await serviceCollection.findOne(service);
          res.send(result)
        });

        app.post('/order', async(req,res)=>{
          const orderService = req.body;
          console.log('hit the post')
          const result = await OrderCollection.insertOne(orderService);
          console.log(result);
          res.json(result);
        });

        app.post('/information', async(req,res)=>{
          const information = req.body;
          console.log('hit the post')
          const result = await informationCollection.insertOne(information);
          console.log(result);
          res.json(result);
        });

        app.get('/order', async(req,res)=>{
          const cursor = OrderCollection.find({});
          const result = await cursor.toArray();
          res.send(result);
        });

        app.delete('/order/:id', async(req,res)=>{
          const id = req.params.id;
          const service = {_id : ObjectId(id)};
          const result = await OrderCollection.deleteOne(service)
          res.json(result)
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