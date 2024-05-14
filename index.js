const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 80;
app.use(cors());
app.use(bodyParser.json());

const uri = "mongodb+srv://dubai52233:Aaqweqweqwe123@cluster0.5p8on8l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let collection;

async function connectDB() {
  try {
    await client.connect();
    const db = client.db("blastinsight");
    collection = db.collection("blastinsight_user");
    console.log('Connected to MongoDB and initialized collection');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
}

// 在应用启动时连接数据库并初始化集合
connectDB().catch(console.error);

app.get('/updatestatus/:address', async (req, res) => {
  console.log("updatestatus start");
  const { address } = req.params;
  try {
    const userData = await collection.findOne({ _id: address });

    if (userData && userData.status === false) {
      await collection.updateOne({ _id: address }, { $set: { "status": true } });
      const updatedUserData = await collection.findOne({ _id: address });
      res.status(200).json(updatedUserData);
    } else {
      res.status(404).send('User not found or already updated');
    }
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).send('Error updating data');
  }
});

app.get('/get/:address', async (req, res) => {
  console.log("get start");
  const { address } = req.params;
  try {
    const userData = await collection.findOne({ _id: address });

    if (userData) {
      res.status(200).json(userData);
    } else {
      const newUser = {
        _id: address,
        status: false
      };
      await collection.insertOne(newUser);
      res.status(200).json(newUser);
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error processing request');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
