const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
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
    app.get('/myTours/:email', async(req, res) =>{
        console.log(req.params.email);
        const result = await orderCollection.find({email: req.params.email}).toArray();
        res.send(result)
    })

    //Post API for orders/booking
    app.post('/orders', async(req, res) =>{
        const order = req.body;
        console.log('hit the order api', order)
        const result = await orderCollection.insertOne(order)
        res.json(result)
    })
 //get Api For Orders/booking
     app.get('/orders', async(req, res)=>{
         const cursor = orderCollection.find({})
         const orders = await cursor.toArray();
         res.send(orders)
     })

    //delete from all orders/booking api
    app.delete('/orders/:id', async (req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await orderCollection.deleteOne(query);
        console.log('deleting user with id', result);
        res.json(result);
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