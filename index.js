const express = require("express");
const app = express();
const port =process.env|5000;
const cors = require("cors");
require("dotenv").config();

app.use(express.json());



app.get("/", (req, res) => {
  res.send("Hello World!");
});

// const corsOptions = {
//   origin: "http://localhost:5173", // Replace with your React app's origin
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
// };

app.use(cors());

//  mongodb  connection

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_Name}:${process.env.DB_KEY}@cluster0.1fsmjmg.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    // collection
    const userCollection = client.db("Alamin").collection("users");
    const SocialCollection = client.db("Alamin").collection("Social");
    const servicesCollection = client.db("Alamin").collection("services");
    const TeamsCollection = client.db("Alamin").collection("Team");

    // save user information

    // save user information
    app.post("/AddUsers", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);

      if (existingUser) {
        return res.send({ message: "user already exists" });
      }

      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    // Get user collection
    app.get("/GetUsers", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    // make admin a normal user
    app.patch("/users/admin/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          role: "admin",
          disabled: true,
        },
      };

      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // get social media information
    app.get("/social", async (req, res) => {
      const result = await SocialCollection.find().toArray();
      res.send(result);
    });
    // add social media information

    app.post("/Social/post", async (req, res) => {
      const data = req.body;
      const result = await SocialCollection.insertOne(data);
      res.send(result);
    });
    // update social information
    app.put("/Social/update/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      console.log(data);
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          name: data.editData.name,
          link: data.editData.link,
          image: data.images,
        },
      };
      const result = await SocialCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // delete social information
    app.delete("/Social/delete/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await SocialCollection.deleteOne(filter);
      res.send(result);
    });
 
    // get Project information
    const ProjectCollection = client.db("Alamin").collection("Project");

    app.get("/Project", async (req, res) => {
      const result = await ProjectCollection.find().toArray();
      res.send(result);
    });

    // add new project

    app.post("/Project/add", async (req, res) => {
      const data = req.body;
      const result = await ProjectCollection.insertOne(data);
      res.send(result);
    });

    // update Project information

    app.put("/Project/update/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          ProjectName: data.name,
          image: data.image,
          description: data.description,
        },
      };

      const result = await ProjectCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // delete Project information

    app.delete("/project/delete", async (req, res) => {
      const { selectedService } = req.body;
      // Convert selectedServiceIds to ObjectId
      console.log(selectedService);
      const objectIds = selectedService.map((id) => new ObjectId(id));
      const filter = { _id: { $in: objectIds } };
      const result = await ProjectCollection.deleteMany(filter);
      res.send(result);
    });

    

    // get services information
    app.get("/services", async (req, res) => {
      const result = await servicesCollection.find().toArray();
      res.send(result);
    });

    // add services information

    app.post("/service/add", async (req, res) => {
      const data = req.body;
      const result = await servicesCollection.insertOne(data);
      res.send(result);
    });

    // update services information

    app.put("/service/update/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc  = {
        $set: {
          service: data.name,
          imageLink: data.image,
          description: data.description,
        },
      };

      const result = await servicesCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // delete services information

    app.delete("/service/delete", async (req, res) => {
      const { selectedService } = req.body;
      // Convert selectedServiceIds to ObjectId
      console.log(selectedService);
      const objectIds = selectedService.map((id) => new ObjectId(id));
      const filter ={_id:{$in:objectIds} };
      const result = await servicesCollection.deleteMany(filter);
        res.send(result)
    });


    // review services information
    // review services information

    const ReviewCollection=client.db("Alamin").collection("Review");

    // get services information
    app.get("/review", async (req, res) => {
      const result = await ReviewCollection.find().toArray();
      res.send(result);
    });

    // add services information

    app.post("/review/add", async (req, res) => {
      const data = req.body;
      const result = await ReviewCollection.insertOne(data);
      res.send(result);
    });

    // update services information

    app.put("/review/update", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          name: data.name,
          image: data.image,
          description: data.description,
        },
      };

      const result = await ReviewCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // delete services information

    app.delete("review/delete", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = ReviewCollection.deleteOne(filter);
      res.send(result);
    });

    // Team members information

    app.get('/team/members', async (req, res) => { 
      const result = await TeamsCollection.find().toArray();
      res.send(result);
    })
 

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
