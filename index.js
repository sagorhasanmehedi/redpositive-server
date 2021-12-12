const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const app = express();
const ObjectId = require("mongodb").ObjectId;
const nodemailer = require("nodemailer");
const mg = require("nodemailer-mailgun-transport");

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
      res.send(result);
    });

    // delete row data
    app.delete("/delete/:id", async (req, res) => {
      const query = { _id: ObjectId(req.params.id) };
      const result = await tableDataCollection.deleteOne(query);
      res.send(result);
    });

    // send email by nodemailer
    app.post("/email", (req, res) => {
      // nodemailer api and domain
      const auth = {
        auth: {
          api_key: `${process.env.API_KEY}`,
          domain: `${process.env.DOMAIN}`,
        },
      };
      const nodemailerMailgun = nodemailer.createTransport(mg(auth));

      nodemailerMailgun.sendMail(
        {
          from: "Mehedi@Hasan.com",
          // to: "info@redpositive.i",
          to: "mehedihasansagor1995@gmail.com",
          subject: "Job Task",
          html: `
           <h3>Name:${req.body.checkBoxData.map((D) => D.name)}</h3>,
          <h3>Phone Number:${req.body.checkBoxData.map(
            (D) => D.phoneNumber
          )}</h3>
           <h3>Hobbies:${req.body.checkBoxData.map((D) => D.hobbies)}</h3>,
           <h3>Email     :${req.body.checkBoxData.map((D) => D.email)}</h3>,
           
           `,
        },
        (err) => {
          if (err) {
            res.send(`${err}`);
          } else {
            res.send("Email send");
          }
        }
      );
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
