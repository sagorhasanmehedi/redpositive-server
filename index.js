const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const app = express();
const ObjectId = require("mongodb").ObjectId;
port = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());
require("dotenv").config();

// mongodb uri

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sovrn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    // mongodb database and collection
    const database = client.db("Redpositive");
    const tableDataCollection = database.collection("tableData");

    // post form data
    app.post("/data", async (req, res) => {
      const result = await tableDataCollection.insertOne(req.body);
      res.send(result);
    });

    // get data
    app.get("/data", async (req, res) => {
      const result = await tableDataCollection.find({}).toArray();
      console.log(result);
      res.send(result);
    });

    // delete row data
    app.delete("/delete/:id", async (req, res) => {
      const query = { _id: ObjectId(req.params.id) };
      const result = await tableDataCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Redpositive server Runing");
});
app.listen(port, () => {
  console.log("Redpositive server runing in ", port);
});
