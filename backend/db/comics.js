import { findOne, updateOne } from './db.js'
import { withDecryptToken } from './token-handler.js';
import { getResponse, getKey } from '../agent/llm.js';
import getComic from '../utils/comic-vine.js';

const issueTemplate = {
    name: "include the official name for the story, if there is more than one story in an issue inlcude both names seperated by a ; example the name of the story from amazing spiderman issue 5 vol 1 is 'Marked for Destruction by Dr. Doom!' ",
    description: "one sentence summary of each story in an issue",
    issue: "number",
    creators: {
        artist: "",
        writer: "",
        editor: ""
    },
    keyIssueFlags: {
        firstAppearancesOfMajorCharacter: "leave null if none",
        DeathOfMajorCharacter: "leave null if none",
        costumeChanges: "leave null if none",
        majorStoryArcs: "leave null if none", 
        crossovers: "leave null if none"
    },
    image: "leave null",
    publicationDate: "",
    publisher: "marvel/dc/ect."
}



async function _addCharacter(token, character, year){
    const characterKey = `characters.${character}.${year}`;
    await updateOne({token : token},{ [characterKey]: {}})
}

async function _addToCharacter(token, character, type, name, vol){
    const key = `characters.${character}.${type}.${name}.${vol}`;
    await updateOne({token : token},{ [key]: []});
}


async function _AddIssue(token, character, type, title, issue, vol, image){
    const prompt = `short answer only, generate a filled out json object based off this template: ${JSON.stringify(issueTemplate)}, and the comic info: ${type} ${title}, vol ${vol}, number ${issue}`;
    const issueObject = await getKey(prompt);
    issueObject.image = image;
    const key = `characters.${character}.${type}.${title}.${vol}.${issue}`;
    await updateOne(
        {token : token},
        {[key]: issueObject}
    );
}


async function _getCharacters(token){
    const results = await findOne({token: token},{ characters: 1});
    return results?.characters || {};
}

export const addCharacter = withDecryptToken(_addCharacter);
export const addToCharacter = withDecryptToken(_addToCharacter);
export const AddIssue = withDecryptToken(_AddIssue);
export const getCharacters = withDecryptToken(_getCharacters);

