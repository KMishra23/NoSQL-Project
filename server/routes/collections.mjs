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
  let collections = await db.listCollections().toArray();
  console.log(collections);
  if(collections.length===0 || collections.indexOf( req.file.originalname.slice(0, req.file.originalname.length-4))!==-1){

    let collection = await db.collection(req.file.originalname.slice(0, req.file.originalname.length-4))
    
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
    res.json({message: 'collection inserted'})  ;
  }
  else{
    res.json({message: 'collection with same file name exists!'})
  }
})

collectionsRouter.get("/", async(req, res) => {
  let collections = await db.listCollections().toArray()
  res.send(collections).status(200)
})

collectionsRouter.get("/:id", async (req, res) => {
  const collection = db.collection(req.params.id);
  const query = collection.find();
  query.limit(100);
  const documents = await query.toArray();
  res.send(documents).status(200);
})
collectionsRouter.delete("/:id", async (req, res) => {
  const collection=db.collection(req.params.id);
  console.log(collection)
  collection.drop()
})
// this section will help create a schema
// router.get("/");

export default collectionsRouter;
