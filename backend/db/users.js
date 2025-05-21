import { encrypt, decrypt, getToken } from '../utils/encryption.js';
import { updateOne, findOne } from './db.js';


const userTemplate = {
    tokens: [],
    userInfo: {
        username: "",
        password: "",
        email: "",
        phone: ""
    },
    characters: {}
    
}



async function createUser(userData, collection){
    const newUser = {...userTemplate}
    const {username, password, email, phone} = userData;
    newUser.userInfo = {
        username,
        password: encrypt(password),
        email,
        phone
    }
    const token = getToken();
    newUser.tokens.push(token);
    await collection.insertOne(newUser);
    return token;
}

async function authorizeUsername(username, collection){
    const result = await collection.find({"userInfo.username": username}).toArray();
    return result.length===0;
}

async function authorizeUser(username, password, collection){
    const results = await findOne(
        collection,
        {"userInfo.username": username},
        {"userInfo.password": 1}
    );
    
    const { iv, encrypted } = results.userInfo.password;
    
    const decryptedPassword = decrypt(iv, encrypted);

    if (decryptedPassword !== password){
        console.log("this should not happen");
        throw new Error("Password is Incorrect");
    }

    await collection.findOne({"userInfo.username": username}) ?? (() => {throw new Error("No user found")})()
    

    const token = getToken();
    await collection.updateOne({"userInfo.username": username},{$push: {tokens: token}});
    
    
    return token;
}

async function getUsername(token, collection){
    const pipeline = [];
    pipeline.push({
        $match: {
            tokens : token
        },
    })
    const result = await collection.aggregate(pipeline).toArray();
    const user = result[0];
    const username = user.userInfo.username;
    return username;
}

async function forgetUserToken(data, collection){
    const {token} = data;
    console.log("discarded token", token);
    await collection.updateOne({ tokens: token }, { $pull: { tokens: token }})
}

export {createUser, authorizeUser, authorizeUsername, getUsername, forgetUserToken}