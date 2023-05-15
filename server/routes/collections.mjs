import express from "express";
import db from "../db/conn.mjs";
import multer from "multer";
import bodyParser from "body-parser";
import cors from "cors"
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

    const type=req.file.originalname.slice(-3)==="csv"?",":"\t";
    let collection = await db.collection(req.file.originalname.slice(0, req.file.originalname.length-4))
    const csvFile = req.file.path;

    fs.readFile(csvFile, "utf8",async (err, data) => {

      const parsedData = d3.dsvFormat(type).parse(data,d3.autoType);
      const docs=Object.keys(parsedData);
      for(let i=0;i<docs.length -1;i++){
        await collection.insertOne(parsedData[docs[i]]).catch( (error)=>{
          res.status(500).send({message: "failure",error})
        })
      }
      res.json({message: 'collection inserted'})  ;
    })
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
    console.log("hojayega")
    const results=db.collection(req.params.id).aggregate(aggs.getStats(req.params.id,req.params.col));
    res.send(results.toArray()).status(200);
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
