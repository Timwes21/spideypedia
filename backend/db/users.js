import { encrypt, decrypt, getToken } from '../utils/encryption.js';
import { updateOne, findOne } from './db.js';
import { decryptToken } from './token-handler.js';


const userTemplate = {
    token: "",
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
    newUser.token = token;
    await collection.insertOne(newUser);
    return encrypt(token);
}

async function authorizeUsername(username, collection){
    const result = await collection.find({"userInfo.username": username}).toArray();
    return result.length===0;
}

async function authorizeUser(user, collection){
    const { username, password } = user;
    const results = await findOne(
        {"userInfo.username": username},
        {"userInfo.password": 1}
    );
    
    const { iv, encrypted } = results.userInfo.password;
    
    const decryptedPassword = decrypt(iv, encrypted);
    console.log(decryptedPassword);

    if (decryptedPassword !== password){
        console.log("this should not happen");
        throw new Error("Password is Incorrect");
    }

    await collection.findOne({"userInfo.username": username}) ?? (() => {throw new Error("No user found")})()
    

    const token = getToken();
    await updateOne({"userInfo.username": username},{token: token});
    return encrypt(token);
}

async function getUsername(encryptedToken, collection){
    const token = decryptToken(encryptedToken);
    const pipeline = [];
    pipeline.push({
        $match: {
            token : token
        },
    })
    const result = await collection.aggregate(pipeline).toArray();
    const user = result[0];
    const username = user.userInfo.username;
    return username;
}

export {createUser, authorizeUser, authorizeUsername, getUsername}