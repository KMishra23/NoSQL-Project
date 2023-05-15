import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import "./loadEnvironment.mjs";
import collectionsRouter from "./routes/collections.mjs";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

// Connect to the MongoDB server
MongoClient.connect(uri, options, function(err, client) {
  if (err) throw err;
  console.log('Connected to MongoDB server');
});
app.use("/collections", collectionsRouter);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});