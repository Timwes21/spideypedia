import { findOne, updateOne } from './db.js'
import { withDecryptToken } from './token-handler.js';
import { getKey } from '../agents/gemini/llm.js';
import fs from "fs";
import path from 'path';
import { fileURLToPath } from 'url'


function deleteFolder(partialPath, folder){
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename); 
    const fullPath = path.join(__dirname, "../images/" + partialPath, folder);
    fs.rm(fullPath, {recursive: true, force: true}, (err)=>{
        if (err){
            console.log(err);
            return;            
        }
        console.log("deleted");
        
    });
}


const issueTemplate = {
    issueRundown:{
        Name: "include the official name for the story, if there is more than one story in an issue inlcude both names seperated by a ; example the name of the story from amazing spiderman issue 5 vol 1 is 'Marked for Destruction by Dr. Doom!' ",
        Artist: "",
        Writer: "",
        'First Appearances': null,
        'Major Deaths': null,
        'Costume Changes': null,
        'Story Arc': null, 
        Crossovers : "",
        'Publication Date': "May 1963 for example",
    },
    image: null,
}



async function _addCharacter(token, character, collection){
    const characterKey = `characters.${character}`;
    console.log(collection);
    
    await updateOne(collection, {token : token},{ [characterKey]: {}})
}

async function _addToCharacter(token, characterData, collection){
    const {character, type, name, vol} = characterData
    const key = `characters.${character}.${type}.${name}.vol ${vol}`;
    await updateOne(collection, {token : token},{ [key]: {}});
}


async function _AddIssue(token, issueDetails, collection){
    const {character, type, title, issue, vol} = issueDetails
    const prompt = `short answer only, generate a filled out json object based off this template: ${JSON.stringify(issueTemplate)}, and the comic info: ${type} ${title}, vol ${vol}, number ${issue}`;
    const issueObject = await getKey(prompt);

    Object.entries(issueObject.issueRundown).map(([key, value])=>{
        if (value === null || value ==="null") delete issueObject.issueRundown[key] 
    });
    
    
    
    const key = `characters.${character}.${type}.${title}.${vol}.${issue}`;
    
    await updateOne(
        collection,
        {token : token},
        {[key]: issueObject}
    );
}

async function _DeleteIssue(token,characterData, collection){
    const { character, type, titleName, vol, issueNumber } = characterData
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
    const partialPath = `../images/${username}/${character}/${type}/${titleName}/${vol}`
    
    delete chars[character][type][titleName][vol][issueNumber];
    deleteFolder(partialPath, issueNumber);
    
    
    if (Object.keys(chars[character][type][titleName][vol]).length === 0){
        delete chars[character][type][titleName][vol];
        deleteFolder(`${username}/${character}/${type}/${titleName}`, vol)
        if ((Object.keys(chars[character][type][titleName]).length === 0)){
            delete chars[character][type][titleName];
            deleteFolder(`${username}/${character}/${type}/`, titleName);
            if ((Object.keys(chars[character][type]).length === 0)){
                delete chars[character][type];
                deleteFolder(`${username}/${character}/`, type);
                if((Object.keys(chars[character]).length === 0)){
                    delete chars[character];
                    deleteFolder(`${username}/`, character);
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

async function _GetPhotoPath(token, char, type, series, vol, issueNumber, collection){
    const pipeline = [];
    pipeline.push({
        $match: {
            token : token
        },
    })
    const result = await collection.aggregate(pipeline).toArray();
    const user = result[0];
    const username = user.userInfo.username;
    const filePath = `${username}/${char}/${type}/${series}/${vol}/${issueNumber}/image.png`;
    return filePath;

}


async function _getCharacters(token, collection){
    const results = await findOne(collection, {token: token},{ characters: 1});
    return results?.characters || {};
}

async function _UpdateDetails(token, characterData, issueDetails, collection) {
    const { character, type, titleName, vol, issueNumber } = characterData;
    const pipeline = [];
    pipeline.push({
        $match: {
            token : token
        },
    })
    const result = await collection.aggregate(pipeline).toArray();
    const user = result[0];
    const chars = user.characters;
    
    chars[character][type][titleName][vol][issueNumber].issueRundown = issueDetails;

    await updateOne(
        collection,
        {token : token},
        {characters: chars}
    )
    

}
export const getPhotoPath = withDecryptToken(_GetPhotoPath); 
export const updateDetails = withDecryptToken(_UpdateDetails); 
export const addCharacter = withDecryptToken(_addCharacter);
export const addToCharacter = withDecryptToken(_addToCharacter);
export const AddIssue = withDecryptToken(_AddIssue);
export const deleteIssue = withDecryptToken(_DeleteIssue)
export const getCharacters = withDecryptToken(_getCharacters);

