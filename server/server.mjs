import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import "./loadEnvironment.mjs";
import records from "./routes/record.mjs";
import router from "./routes/record.mjs";


const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI
mongoose.connect(uri, {dbName: 'test', useNewUrlParser: true})
.then(() => console.log("Connection Established"))
.catch((error) => console.log(error))

app.use("/record", records);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});