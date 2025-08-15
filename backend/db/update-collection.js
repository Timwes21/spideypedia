import { updateOne } from './db.js'
import { getKey } from '../agents/gemini/llm.js';
import { deleteImage, uploadImageToCloudinary } from '../utils/cloudinary.js';
import { issueRundownTemplate } from '../templates.js';





const issueTemplate = {
    issueRundown:{...issueRundownTemplate},
    image: {
        url: null,
        pubicID: null
    },
}


async function addCharacter(data, collection){
    console.log(data);
    
    const {token, character} = data;
    const characterKey = `characters.${character}`;
    
    const result = await collection.updateOne({tokens : token},{$set: { [characterKey]: {}}})
    return result;
}

async function addToCharacter(data, collection){
    console.log("in addToCharacter \n");
    
    const { token, characterData } = data;
    const { character, type, name } = characterData
    const key = `characters.${character}.${type}.${name}`;
    const finalResult = await collection.updateOne({tokens : token},{$set: {[key]: {}}});
    return finalResult;
}

async function addVolume(data, collection){
    const { token, characterData } = data;
    const { character, type, title, vol } = characterData
    const key = `characters.${character}.${type}.${title}.vol ${vol}`;
    const finalResult = await collection.updateOne({tokens : token},{$set: {[key]: {}}});
    return finalResult;
}


async function addIssue(data, collection){
    console.log("In add issue \n");
    
    const {token, issueDetails, path} = data;
    const {character, type, titleName, issueNumber, vol} = JSON.parse(issueDetails)
    
    const prompt = `short answer only, generate a filled out json object based off this template: ${JSON.stringify(issueTemplate)}, and the comic info: ${type} ${titleName}, vol ${vol}, number ${issueNumber}, , and do not include any citations for example [1, 2, 4], and please use dot notation to add it so you dont override anything already in the database.`;
    const issueObject = await getKey(prompt);
    console.log(issueObject);
    
    Object.entries(issueObject.issueRundown).map(([key, value])=>{
        if (value === null || value ==="null") delete issueObject.issueRundown[key]; 
    });
    
    if (path){
        try{
            const result = await uploadImageToCloudinary(path);
            issueObject.image = result;
        }
        catch(err){
            issueObject.image = err;
        }
    }
        
    
    const key = `characters.${character.trim()}.${type.trim()}.${titleName.trim()}.${vol.trim()}.${issueNumber.trim()}`;
    console.log("key for adding issue: ", key);
    
    
    const finalResult = await collection.updateOne(
        {tokens : token},
        {$set: {[key]: issueObject}}
    );

    return finalResult;
}

async function deleteIssue(data, collection){
    const { token, characterData } = data;
    const { character, type, titleName, vol, issueNumber } = characterData;
    const pipeline = [];
    pipeline.push({
        $match: {
            tokens : token
        },
    })
    const result = await collection.aggregate(pipeline).toArray();
    const user = result[0];
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
    const finalResult = await collection.updateOne(
        {tokens : token},
        {$set: {characters: chars}}
    )

    return finalResult;
    

}

async function getCharacters(token, collection){

    console.log(token);
    
    const results = await collection.findOne({tokens: token},{projection: { characters: 1, _id: 0}});
    
    
    return results?.characters || {};
}

async function updateDetails(data, collection) {    
    const { token, characterData, issueDetailList, path } = data;
    const issueDetails = JSON.parse(issueDetailList);
    const { character, type, titleName, vol, issueNumber } = JSON.parse(characterData);
    const pipeline = [];
    pipeline.push({
        $match: {
            tokens : token
        },
    })
    const result = await collection.aggregate(pipeline).toArray();
    const user = result[0];
    const chars = user.characters;
    console.log(character);
    
    
    if (path){
        console.log('here');
        
        const imageData = chars[character][type][titleName][vol][issueNumber]?.image || null
        if (imageData){
            deleteImage(imageData.publicID);
        }
        try{
            const result = await uploadImageToCloudinary(path);
            chars[character][type][titleName][vol][issueNumber].image = result
        }
        catch(err){
            chars[character][type][titleName][vol][issueNumber].image = err
        }
    }
    chars[character][type][titleName][vol][issueNumber].issueRundown = issueDetails;
    
    const finalResult = await collection.updateOne(
        {tokens : token},
        {$set: {characters: chars}}
    )

    return finalResult;
}

async function deleteChar(data, collection){
    const {token, character} = data;
    const pipeline = [];
    pipeline.push({
        $match: {
            tokens : token
        },
    })
    const result = await collection.aggregate(pipeline).toArray();
    const user = result[0];
    const chars = user.characters;
    delete chars[character];
    
    const finalResult = await collection.updateOne(
        {tokens : token},
        {$set:{characters: chars}}
    )
    return finalResult
    

}




const updateCollectionRouteHandler = {
    "add-character":addCharacter,
    "add-title":addToCharacter,
    "add-issue":addIssue,
    "delete-issue":deleteIssue,
    "update-details":updateDetails,
    "delete-char":deleteChar,
    "add-vol": addVolume
}

export { updateCollectionRouteHandler, getCharacters}