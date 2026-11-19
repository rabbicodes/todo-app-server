import express from 'express'
import cors from 'cors'
import 'dotenv/config'

const app = express()
const port = process.env.PORT ||8000
app.use(cors())
app.use(express.json())

import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URL);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}
const mongoClient = await connectToMongoDB()
const db = mongoClient.db('MytodoApp')
const todoCollection = db.collection('Todos')
const completeTodoCollection = db.collection('Complete_Todos')



app.post('/todos',async(req,res)=>{
    const data = await  req.body
    const result = await todoCollection.insertOne(data)
    res.send(result)

})
app.patch('/todos/:id',async(req,res)=>{
    const {id}=req.params
    const data = req.body
    const result = await todoCollection.updateOne({_id:new ObjectId(id)},{$set:data})
    res.send(result)
})
app.get('/todos',async(req,res)=>{
    const result = await todoCollection.find().toArray();
    res.send(result)
})
app.delete('/todos/:id',async(req,res)=>{
    const {id}=req.params;
    const result = await todoCollection.deleteOne({_id:new ObjectId(id)})
    res.send(result)
})

app.post('/complete-todos',async (req,res)=>{
    const data = await req.body
    const result= await completeTodoCollection.insertOne(data)
    res.send(result)

})
app.delete('/complete-todos/:id', async (req, res) => {
    const { id } = req.params;

    const result = await completeTodoCollection.deleteOne({
        _id: id
    });

    res.send(result);
});
app.get('/complete-todos',async(req,res)=>{
    const result = await completeTodoCollection.find().toArray()
    res.send(result)
})

app.get('/',(req,res)=>{
    res.send({message:'Server is running well!'})
})

app.listen(port,()=>{
    console.log(`Server is running at ${port}`);
})

export default app