import { MongoClient } from "mongodb";

const connectionString = process.env.MONGODB_URI || "";

// console.log(process.env.MONGODB_URI || "")

const client = new MongoClient(connectionString);

let conn;
try {
  conn = await client.connect();
//   console.log("connected")
} catch(e) {
  console.error(e);
}

let db = conn.db("test");

export default db;