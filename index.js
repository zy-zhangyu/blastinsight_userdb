const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 80
const cors = require('cors');
app.use(cors());

app.use(bodyParser.json());
const uri = "mongodb+srv://dubai52233:Aaqweqweqwe123@cluster0.5p8on8l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connectDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
}

//energy +1  (差不多36秒)
app.get('/updatestatus/:address', async (req, res) => {
  console.log("updatestatus  start111111111111")
  const { address } = req.params;
  try {
    await connectDB();
    const collection = client.db("blastinsight").collection("blastinsight_user");
    const userData = await collection.findOne({ _id: address });

    if (userData && userData.status) {
      // 用户存在，计算新的energy值
      await collection.updateOne({ _id: address }, { $set: { "status": true } });
      const updatedUserData = await collection.findOne({ _id: address });
      res.status(200).json(updatedUserData);
    }
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).send('Error updating data');
  }
});

// 读取数据
app.get('/get/:address', async (req, res) => {
  console.log("get  start111111111111")
  const { address } = req.params;
  try {
    await connectDB();
    const collection = client.db("blastinsight").collection("blastinsight_user");
    // 尝试查找现有用户数据
    const userData = await collection.findOne({ _id: address });
    if (userData && userData.status) {
      res.status(200).json(userData);
    } else {
      // 用户不存在，创建新用户并返回整个新用户数据
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