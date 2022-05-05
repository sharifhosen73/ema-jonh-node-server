const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;


//middlewire
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v5n2r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        
        const database = client.db('ema-jonh');
        const productCollection = database.collection('products')

        //GET API
        app.get('/products', async(req, res)=>{
            // console.log(req.query)
            const cursor = productCollection.find({})
            //const count = await cursor.count()
            const page = req.query.page
            const size = parseInt(req.query.size) 
            const products = await cursor.toArray()
            // let products;
            // if(page){
            //     products = await cursor.skip(page*size).limit(size).toArray();
            // }
            // else{
            //     //products = await cursor.toArray()
            // }
            
            res.send(products)
            // {
            //     count,
            //     products
            // }
        })

        // POST API
        app.post('/addProduct', async(req, res) =>{
            const products = req.body
            productCollection.insertMany(products)
            .then(result => res.send(result.insertedCount))
        })
    }
    finally{
        
    }
}
run().catch(console.dir)

app.get('/', (req, res)=>{
    res.send('Ema jonh server is running')
})

app.listen(port, ()=>{
    console.log('Ema jonh server is running', port)
})
