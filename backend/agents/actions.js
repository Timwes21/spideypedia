import { publish } from "../utils/redis.js";
import { getKey } from "./gemini/llm.js";
import { updateTemplate, aggregateTemplate, comicBookDbTemplate, triviaTemplate, unsureTemplate, viewTemplate, addTemplate, removeTemplate, issueRundownTemplate, addManyIssuePromptTemplate, addManyIssueTemplate } from "./templates.js";

function capitalizeFirstLetterOnly(string){
    function capitalizeFirstLetter(string2){
        const firstLetter = string2.toLowerCase().charAt(0).toUpperCase()
        const lowerCaseBody = string2.slice(1).toLowerCase();
        return firstLetter + lowerCaseBody
    }
    const wordSplitBySpace = string.split(" ");
    const newWords = []
    for (const word of wordSplitBySpace){
        newWords.push(capitalizeFirstLetter(word));
    }
    return newWords.join(" ");
}

export const Actions = {
    header: "",
    task: "",
    input: "",
    collection: "",
    token: "",

    construct: function(input, collection, token){
        this.input = input
        this.collection = collection
        this.token = token
        return this;
    },
    addManyIssuesPrompt: function(){
        this.header = "The user wants to add multiple issues to their comic collection being handled in a mongodb database, the structure of the database looks like this: " + JSON.stringify(comicBookDbTemplate);
        this.task = `Fill out this template based n the users input: ${JSON.stringify(addManyIssuePromptTemplate)}`;
        return this;
    },
    addManyIssues:async  function(key){
        console.log(key);        
        let results = []
        const issues = key.issuesNumbers;
        const {titleName, vol, character, type} = key.issueDetails; 
        const setVol =vol.includes("vol")?vol:"vol " + vol
        const newTitleName = capitalizeFirstLetterOnly(titleName);
        console.log(newTitleName);
        
        const newCharacter = capitalizeFirstLetterOnly(character)
        for (const issue of issues){
            const prompt = `return a filled out version of ${JSON.stringify(issueRundownTemplate)} based on the ${type} ${titleName}, vol ${vol}, issue ${issue}, don't include if it will be null, and do not include any citations for example [1, 2, 4], and please use dot notation to add it so you dont override anything already in the database.`
            const output = await getKey(prompt);
            for (const [key, value] of Object.entries(output)){
                value ?? delete output[key];
            }
            const filter = {token: this.token}
            const update = {$set: {[`characters.${newCharacter}.${type}.${newTitleName}.${setVol}.${issue}.issueRundown`]: output}}
            const result = await this.collection.updateOne(filter, update);
            await publish(this.token);
            results.push(result);
        }
        this.header = `You added many issues to the users collection and here is the result ${JSON.stringify(results)}`;
        this.task = "generate a response for the user based on their input and result in no more than 25 words";
        return this;

    },
    addPrompt: function (){
        this.header = "The user wants to add to their comic collection being handled in a mongodb database, the structure of the database looks like this: " + JSON.stringify(comicBookDbTemplate);
        this.task = `fill out this template so i can JSON.parse() it : ${JSON.stringify(updateTemplate)} with the user token: ${this.token}. Do not include fields that will remain null, and do not include any citations for example [1, 2, 4], and please use dot notation to add it so you dont override anything already in the database` 
        return this;
    },
    add: async function(key){
        console.dir(key, {depth:null});
        
        if (key.beingAdded === "issue"){
            try{
                const update = key.updateAndOption.update;
                const filter = key.updateAndOption.filter;
                const result = await this.collection.updateOne(filter, update);  
                this.header = `You added an issue to the users comic collection and here is the result: ${JSON.stringify(result)}`;
                this.task = "generate a response based on the result and user input in no more than 25 words";
                await publish(this.token);
                return this;
            }
            catch(error){
                console.log(error);   
                this.header = `You tried adding an issue to the users collection but it might not exist`;
                this.task = "generate a response for the user in no more than 25 words";
                return this;
            }
        }
        const result = await this.collection.updateOne(key.updateAndOption.filter, key.updateAndOption.update);
        this.header = `You added something to the users collection and here is the result ${JSON.stringify(result)}`;
        this.task = "generate a response for the user based on their input and result in no more than 25 words";
        await publish(this.token);
        return this;
    }, 
    removePrompt: function (){
        this.header = "The user wants to remove from their comic collection being handled in a mongodb database, the structure of the database looks like this: " + JSON.stringify(comicBookDbTemplate);
        this.task = `fill out this template so i can JSON.parse() it : ${JSON.stringify(updateTemplate)} with the user token: ${this.token}`
        return this;
    },

    remove: async function(agentOutput){
        const { filter, update } = agentOutput.updateAndOption;
        
        const result =  await this.collection.updateOne(filter, update);
        this.header = `you are part of a comic management application. You provided a pipeline to aggregate the mongodb db and the results were: ${result}`;
        this.task = "formulate ONLY a response for the user as this will be read by them, If the user asked about the data and results are empty or undefined provide a response indicating nothing was found.";
        await publish(this.token);
        return this;
    },
    trivia: function(){
        this.task = "answer the user in no more than 25 words";
        this.header = "The user wants a general response";
        return this;
    },
    unsure: function(){
        this.task = "answer the user in no more than 25 words";
        this.header = "The user sent something but its uncertain what they want, ask to verify what they need";
        return this;
    },
    checkDatabasePrompt: function(){
        this.header = "The user wants to check their comic collection being handled in a mongodb database, the structure of the database looks like this: " + JSON.stringify(comicBookDbTemplate);
        this.task = `fill out this template and add an aray of aggregates that will find what the user is looking for: ${JSON.stringify(aggregateTemplate)} with the user token: ${this.token}`
        return this;
    },
    checkDatabase: async function(agentOutput){
        const aggregates = agentOutput.arrayOfAggregates
        console.log(aggregates);
        const result = await this.collection.aggregate(aggregates).toArray();
        console.log(result);
        
        this.header = `You completed an operation to see if the user had something in their comic collection from mongodb and here is the result: ${JSON.stringify(result)}`;
        this.task = "Based on the user input and what is found in the result, in simplistic terms answer the user";
        return this;

    },
    analyzeInput: function(){
        this.header = `you will take the role of a comic book trivia expert, and be used inside a comic book management application, with a mongodb database. Return ONLY a json object`;
        this.task = `return one of these templates based in the users input, in json form so i can JSON.parse() them: ${JSON.stringify(addTemplate)}; ${JSON.stringify(removeTemplate)}; ${JSON.stringify(triviaTemplate)}; ${JSON.stringify(viewTemplate)}; ${JSON.stringify(unsureTemplate)}, ${JSON.stringify(addManyIssueTemplate)}`;
        return this;
    },
    generatePromptGemini: function() {
        return{
            role: "comic book trivia expert, and user comic book database manager",
            header: this.header,
            task: this.task,
            userInput: this.input,
            
        }
    }
    
}    