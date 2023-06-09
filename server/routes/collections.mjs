import express from "express";
import db from "../db/conn.mjs";
import multer from "multer";
import bodyParser from "body-parser";
import cors from "cors";
import csv from "csvtojson"
import fs from 'fs'
import * as d3 from "d3";
import * as aggs from "./aggregates.mjs";

const collectionsRouter = express.Router();
const upload = multer({dest: 'uploads/'})

collectionsRouter.use(cors())
collectionsRouter.use(bodyParser.urlencoded({extended: false}))
collectionsRouter.use(bodyParser.json())

collectionsRouter.post("/", upload.single('file'), async(req, res) => {
  let collections = await db.listCollections().toArray();
  if(collections.length===0 || collections.indexOf( req.file.originalname.slice(0, req.file.originalname.length-4))===-1){

    const fileExt=req.file.originalname.slice(-3)==="csv"?",":"\t";
    let collection = await db.collection(req.file.originalname.slice(0, req.file.originalname.length-4))
    const csvFile = req.file.path;

    // fs.readFile(csvFile, "utf8",async (err, data) => {

    //   const parsedData = d3.dsvFormat(type).parse(data);
    //   const docs=Object.keys(parsedData);
    //   for(let i=0;i<docs.length -1;i++){
    //     await collection.insertOne(parsedData[docs[i]]).catch( (error)=>{
    //       res.status(500).send({message: "failure",error})
    //     })
    //   }
    //   res.json({message: 'collection inserted'})  ;
    // })
    var theThing;
    if(fileExt ==="\t") {
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
      for(var i = 0; i < jsonObj.length; i++) {
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

collectionsRouter.get("/:id/:col", async (req, res) => {
  if(req.params.col==="columns"){
    const collection = await db.collection(req.params.id).findOne()
    res.send(Object.keys(collection)).status(200);
  }
  else{
    const collection= db.collection(req.params.id);
    const cursor=collection.aggregate(aggs.getStats(req.params.id,req.params.col));
    if(cursor.hasNext()){
      await cursor.next().then((response)=>{
        if(response!==null){
          res.send(response).status(200);
        }
        else{
          res.status(204).send({message: "stringColumn"})
        }
      })
    }
  }
})
collectionsRouter.get("/:id", async (req, res) => {
  const collection = db.collection(req.params.id);
  const query = collection.find();
  query.limit(100);
  const documents = await query.toArray();
  res.send(documents).status(200);
})
collectionsRouter.delete("/:id", async (req, res) => {
  const response= await db.collection(req.params.id).drop();
  if(response) res.status(200);
})


export default collectionsRouter;
