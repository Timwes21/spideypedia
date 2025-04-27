import 'dotenv/config';
import { MongoClient } from 'mongodb';


const env = (e) => process.env[e];
const client = new MongoClient(env("URL"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = client.db("comicManagement");
export const productionCollection = db.collection("users");
export const testCollection = db.collection("test");


export async function updateOne(collection, where, update){    
    await collection.updateOne(
        where,
        {$set: update}
    );
}


export async function findOne(collection, where, retrieve){
    return await collection.findOne(
        where,
        {projection: {...retrieve, _id: 0}}
    );
}








