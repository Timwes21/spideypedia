import { updateCollectionRouteHandler, getCharacters} from "../db/update-collection.js"
import { testCollection } from "../db/db.js"

const token = "token";
const match = {tokens: [token]}

// const updateCollectionRouteHandler = {
//     "add-character":addCharacter,
//     "add-title":addToCharacter,
//     "add-issue":addIssue,
//     "delete-issue":deleteIssue,
//     "update-details":updateDetails,
//     "delete-char":deleteChar
// }




test('adds a character', async()=>{
    await testCollection.updateOne({tokens: token}, {$unset: {characters: "Superman"}})
    const data = {token: token, character: "Superman"}
    const result = await updateCollectionRouteHandler['add-character'](data, testCollection);
    console.log(result);
    
    const valid = (result.matchedCount === 1 && result.modifiedCount === 1)?true: false;
    expect(valid).toBe(true);
})

test('adds a title', async()=>{
    const title = "Spectacular Spider-man"
    const data = {
        token: token, 
        characterData: {
            character: "Spider-man",
            type: "Series",
            name: title,
            vol : "1"
        }
    }
    const result = await updateCollectionRouteHandler['add-title'](data, testCollection);
    const valid = (result.matchedCount === 1 && result.modifiedCount === 1)?true: false;
    expect(valid).toBe(true)
})


test('adds an issue', async()=>{
    const data = {
        token: token,
        issueDetails: '{"character": "Spider-man", "type": "Series", "titleName": "Amazing Spider-man", "issueNumber": "20", "vol": "1"}', 
        path: "" 
    } 
    const result = await updateCollectionRouteHandler['add-issue'](data, testCollection);
    const valid = (result.matchedCount === 1 && result.modifiedCount === 1)?true: false;
    expect(valid).toBe(true);
})

test('deletes an issue', async()=>{
    const data = {
        token: token,
        characterData: {
            character: "Spider-man", 
            type: "Series", 
            titleName: "Amazing Spider-man", 
            issueNumber: "21", 
            vol: "1"
        }, 
    }
    await testCollection.updateOne({tokens: token}, {$set: {"characters.Spider-man.Series.Amazing Spider-man.1.21": {issueRundown: {}, image: ""}}});
    const result = await updateCollectionRouteHandler['delete-issue'](data, testCollection);
    const valid = (result.matchedCount === 1 && result.modifiedCount === 1)?true: false;
    expect(valid).toBe(true);
})

test('update issue details', async()=>{
    const data = {
        token: "token", 
        characterData: '{"character": "Batman", "type": "Series", "titleName": "Detective Comics", "vol": "1", "issueNumber": "400"}', 
        issueDetailList: '{"Name": "Killer croc"}', 
        path: ""
    }

    await testCollection.updateOne({tokens: token}, {$set: {"characters.Batman.Series.Detective Comics.1.400": {issueRundown: {}, image: ""}}});
    const result = await updateCollectionRouteHandler['update-details'](data, testCollection);
    const valid = (result.matchedCount === 1 && result.modifiedCount === 1)?true: false;
    expect(valid).toBe(true);
})

test('deletes a character', async()=>{
    const data = {
        token: token,
        character: "Moon Knight"
    }
    await testCollection.updateOne({tokens: token}, {$set: {"characters.Moon Knight": {}}});
    const result = await updateCollectionRouteHandler['delete-char'](data, testCollection);
    const valid = (result.matchedCount === 1 && result.modifiedCount === 1)?true: false;
    expect(valid).toBe(true);
})


test('gets a character list', async()=>{
    const result = await getCharacters(token, testCollection);
    expect(typeof result).toBe("object")
})