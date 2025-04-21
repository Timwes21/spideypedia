import { encrypt, decrypt, getToken } from '../utils/encryption.js';
import { updateOne, findOne, collection } from './db.js';


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



async function createUser(userData){
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

async function authorizeUsername(username){
    const result = await collection.find({"userInfo.username": username}).toArray();
    return result.length===0;
}

async function authorizeUser(user){
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
export {createUser, authorizeUser, authorizeUsername}