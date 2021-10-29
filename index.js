const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mieka.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run(){
      try{
          await client.connect();
          console.log('connected to db')
          const database = client.db('tourism');
          const tourCollection =  database.collection('tours')
          const orderCollection = database.collection('orders8')

      //Get API 
      app.get('/tours', async (req, res) =>{
          const cursor = tourCollection.find({});
          const tours = await cursor.toArray();
          res.send(tours);
      })


      //Post API
      app.post('/tours', async(req, res) =>{
          const tour = req.body
        console.log('hit the post api', tour);
        const result = await tourCollection.insertOne(tour)
        res.json(result);
      })

    // get api for orders
    app.get('/orders', async(req, res) =>{
        const cursor = orderCollection.find({});
        const orders = await cursor.toArray();
        res.send(orders)
    })

    //Post API for orders
    app.post('/orders', async(req, res) =>{
        const order = req.body;
        console.log('hit the order api', order)
        const result = await orderCollection.insertOne(order)
        res.json(result)
    })

      }

      finally{

    // await client.close()
      }

}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('running tourism server')
})

app.listen(port, () => {
    console.log('running tourism server', port);
})