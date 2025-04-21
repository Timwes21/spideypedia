import 'dotenv/config';
import { MongoClient } from 'mongodb';


const env = (e) => process.env[e]
const client = new MongoClient(env("url"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = client.db("comicManagement");
export const collection = db.collection("users");

export async function updateOne(where, update){    
    await collection.updateOne(
        where,
        {$set: update}
    );
}


export async function findOne(where, retrieve){
    return await collection.findOne(
        where,
        {projection: {...retrieve, _id: 0}}
    );
}


  





