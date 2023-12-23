const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cp7ahlj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection


    const TaskManagementCollection=client.db('TaskManagement').collection('CreateTask');
    

    app.post('/management',async(req,res)=>{
        const task =req.body;
        const result= await TaskManagementCollection.insertOne(task);
        res.send(result);
      })

      app.get('/management',async(req,res)=>{
        const result= await TaskManagementCollection.find().toArray()
        res.send(result);
      })

      app.get('/management/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await TaskManagementCollection.findOne(query);
        res.send(result);
      })

       // update
    app.patch('/management/:id', async (req, res) => {
        const item = req.body;
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) }
        const updatedDoc = {
          $set: {
                   Title: item.Title,
                   Deadline: item.Deadline,
                   Description:item.Description,
                   priority:item.priority,
                   department:item.department,
                  
          }
        }
  
        const result = await TaskManagementCollection.updateOne(filter, updatedDoc)
        res.send(result);
      })

    //   delete operation
    app.delete('/management/:id',async(req,res)=>{
        const id = req.params.id;
        const query= {_id: new ObjectId(id)}
        const result= await TaskManagementCollection.deleteOne(query);
        res.send(result);
    })



    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/',(req,res)=>{
    res.send('task management server')
})

app.listen(port,()=>{
    console.log(`task management platform on port ${port}`);
})