import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import mongoose, { modelNames } from "mongoose";

const collectionsRouter = express.Router();


collectionsRouter.post("/", async (req, res) => {
    const file = req.file
    console.log(req)
    console.log(req.body)
    res.json({message: 'file here'})
    // var tempSchema = mongoose.Schema({}, {strict: false})
    // var thing = mongoose.model('Thing', tempSchema)
})

// This section will help you get a list of all the records.
collectionsRouter.get("/", async (req, res) => {
  let collection = await db.collection("records");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

// this section will help create a schema
// router.get("/");

export default collectionsRouter;
