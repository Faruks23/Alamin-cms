const express = require("express");
const app = express();
const port =process.env|5000;
const cors = require("cors");
app.use(cors())
app.use(express.json());
 
const pass = "zk7mmVknqmQvUuma";
const name = "Alamin";

app.get("/", (req, res) => {
  res.send("Hello World!");
});



//  mongodb  connection

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://Alamin:zk7mmVknqmQvUuma@cluster0.1fsmjmg.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // collection
    const userCollection = client.db("Alamin").collection("users");
     const servicesCollection = client.db("Alamin").collection("services");
    // save user information

    app.post("/users", async (req, res) => {
      const data = req.body;
      const result = await userCollection.insertOne(data);
      res.send(result);
    });

    // get services information
    app.get("/services", async (req, res) => {
        
      const result = await servicesCollection.find().toArray();
       res.send(result);
       
    });






    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
