import { findOne, updateOne } from './db.js'
import { getKey } from '../agents/gemini/llm.js';
import fs from "fs"
import { deleteImage, uploadImageToCloudinary } from '../utils/cloudinary.js';




const issueTemplate = {
    issueRundown:{
        Name: "include the official name for the story, if there is more than one story in an issue include both names seperated by a ; example the name of the story from amazing spiderman issue 5 vol 1 is 'Marked for Destruction by Dr. Doom!' ",
        Artist: "",
        Writer: "",
        'First Appearances': null,
        'Major Deaths': null,
        'Costume Changes': null,
        'Story Arc': null, 
        Crossovers : "",
        'Publication Date': "May 1963 for example",
    },
    image: {
        url: null,
        pubicID: null
    },
}


async function addCharacter(data, collection){
    const {token, character} = data;
    const characterKey = `characters.${character}`;
    console.log(collection);
    
    await updateOne(collection, {token : token},{ [characterKey]: {}})
}

async function addToCharacter(data, collection){
    const { token, characterData } = data;
    const {character, type, name, vol} = characterData
    const key = `characters.${character}.${type}.${name}.vol ${vol}`;
    await updateOne(collection, {token : token},{ [key]: {}});
}


async function addIssue(data, collection){
    const {token, issueDetails, path} = data;
    const {character, type, titleName, issueNumber, vol} = JSON.parse(issueDetails)
    
    const prompt = `short answer only, generate a filled out json object based off this template: ${JSON.stringify(issueTemplate)}, and the comic info: ${type} ${titleName}, vol ${vol}, number ${issueNumber}`;
    const issueObject = await getKey(prompt);
    console.log(issueObject);
    
    Object.entries(issueObject.issueRundown).map(([key, value])=>{
        if (value === null || value ==="null") delete issueObject.issueRundown[key]; 
    });
    
    if (path !== undefined){
        const url = await uploadImageToCloudinary(path.replace(/\\/g, "/"));
        fs.promises.unlink(path);
        issueObject.image = url;
    }
    
    
    const key = `characters.${character}.${type}.${titleName}.${vol}.${issueNumber}`;
    
    await updateOne(
        collection,
        {token : token},
        {[key]: issueObject}
    );
}

async function deleteIssue(data, collection){
    const { token, characterData } = data;
    const { character, type, titleName, vol, issueNumber } = characterData;
    const pipeline = [];
    pipeline.push({
        $match: {
            token : token
        },
    })
    const result = await collection.aggregate(pipeline).toArray();
    const user = result[0];
    const username = user.userInfo.username;
    const chars = user.characters;
    const image = chars[character][type][titleName][vol][issueNumber].image;
    if (image){
        deleteImage(image.publicID);
    }
    delete chars[character][type][titleName][vol][issueNumber];
    
    
    
    if (Object.keys(chars[character][type][titleName][vol]).length === 0){
        delete chars[character][type][titleName][vol];
        if ((Object.keys(chars[character][type][titleName]).length === 0)){
            delete chars[character][type][titleName];
            if ((Object.keys(chars[character][type]).length === 0)){
                delete chars[character][type];
                if((Object.keys(chars[character]).length === 0)){
                    delete chars[character];
                }
            }
        }
    }
    await updateOne(
        collection,
        {token : token},
        {characters: chars}
    )
    

}

async function getCharacters(token, collection){
    const results = await findOne(collection, {token: token},{ characters: 1});
    return results?.characters || {};
}

async function updateDetails(data, collection) {
    let { token, characterData, issueDetails, path } = data;
    issueDetails = JSON.parse(issueDetails);
    const { character, type, titleName, vol, issueNumber } = JSON.parse(characterData);
    const pipeline = [];
    pipeline.push({
        $match: {
            token : token
        },
    })
    const result = await collection.aggregate(pipeline).toArray();
    const user = result[0];
    const chars = user.characters;
    console.log(character);
    
    
    if (path){
        const imageData = chars[character][type][titleName][vol][issueNumber]?.image || null
        if (imageData){
            deleteImage(imageData.publicID);
        }
        const url = await uploadImageToCloudinary(path.replace(/\\/g, "/"));
        fs.promises.unlink(path);
        chars[character][type][titleName][vol][issueNumber].image = url;
    }
    chars[character][type][titleName][vol][issueNumber].issueRundown = issueDetails;
    
    await updateOne(
        collection,
        {token : token},
        {characters: chars}
    )
}

async function deleteChar(data, collection){
    const {token, character} = data;
    const pipeline = [];
    pipeline.push({
        $match: {
            token : token
        },
    })
    const result = await collection.aggregate(pipeline).toArray();
    const user = result[0];
    const chars = user.characters;
    delete chars[character];
    
    await updateOne(
        collection,
        {token : token},
        {characters: chars}
    )
    

}




const updateCollectionRouteHandler = {
    "add-character":addCharacter,
    "add-title":addToCharacter,
    "add-issue":addIssue,
    "delete-issue":deleteIssue,
    "update-details":updateDetails,
    "delete-char":deleteChar
}

export { updateCollectionRouteHandler, getCharacters}