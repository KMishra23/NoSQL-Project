import express from "express";
import db from "../db/conn.mjs";
import multer from "multer";
import bodyParser from "body-parser";
import cors from "cors"
import csv from "csvtojson"
import { ObjectId } from "mongodb";
import mongoose, { modelNames } from "mongoose";

const collectionsRouter = express.Router();
const upload = multer({dest: 'uploads/'})

collectionsRouter.use(cors())
collectionsRouter.use(bodyParser.urlencoded({extended: false}))
collectionsRouter.use(bodyParser.json())

collectionsRouter.post("/", upload.single('file'), async(req, res) => {
  // console.log(req.file)

  let collection = await db.collection(req.file.originalname.slice(0, req.file.originalname.length-4))

  // console.log(t)
  
  var fileExt = req.file.originalname.slice(-3)
  var theThing;
  if(fileExt === "tsv") {
    console.log("reading a tsv")
    theThing = csv({
      delimiter: ["\t"]
    })
  }
  else {
    theThing = csv()
  }


  theThing
  .fromFile(req.file.path)
  .then(async(jsonObj) => {
    // console.log(jsonObj)
    for(var i = 0; i < jsonObj.length; i++) {
      // console.log("added " + i)
      await collection.insertOne(jsonObj[i])
    }
  }).catch((error) => {
    res.status(500).send({
      message: "failure",
      error
    })
  })
  // let t = await db.listCollections().toArray()

  res.json({message: 'file here'})  
})

// This section will help you get a list of all the records.
// collectionsRouter.get("/", async (req, res) => {
//   let collection = await db.collection("records");
//   let results = await collection.find({}).toArray();
//   res.send(results).status(200);
// });

// returns all collections present in the db
collectionsRouter.get("/", async(req, res) => {
  let collections = await db.listCollections().toArray()
  res.send(collections).status(200)
})

// this section will help create a schema
// router.get("/");

export default collectionsRouter;
