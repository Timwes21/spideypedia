import { getResponse } from "./gemini/llm.js";
import {  comicBookDbTemplate, decideConfig, issueRundownConfig, issueRundownTemplate, updateConfig } from "./templates.js";

export const Actions = {
    config: "",
    token: "",
    input: "",
    content: "",
    collection: "",
    structuredResearch: "",

    construct: function(input, token, collection){
        this.input = input
        this.token = token
        this.collection = collection
        return this;
    },


    addOutput: function(){
        this.content = {
            role: "user",
            parts: [{ text: this.input }],
        }
        this.config = {
            systemInstruction: `The user wants to add to their database which is built like ${JSON.stringify(comicBookDbTemplate)}, generate needed response`,
            ...updateConfig
        }
        console.log("made it to addOutput");
        
        return this;
    }, 

    addIssue: async function (issueRundown){
        const json = this.json;
        try{
            
            console.log("issue rundown: ", issueRundown);
            console.log('here');
            console.log(json);
            
            const update = json.updateAndOption.update;
            const filter = json.updateAndOption.filter;
            const parsedUpdate = JSON.parse(update);
            const parsedFilter = JSON.parse(filter)
            console.log(parsedUpdate["$set"]);
            
            const key = parsedUpdate['$set'][Object.keys(parsedUpdate)[0]]
            const result = await this.collection.updateOne(parsedFilter,{ $set: {[key]: issueRundown}});
            this.config = {
                systemInstruction: `The user added something and here is the result: ${JSON.stringify(result)}, generate a response to them`
            }
            return this;    
        }
        catch(err){
            console.log(err);
            this.config = {
                systemInstruction: "The user attempted to add an issue to their comic collection but it went wrong, explain so it no less than 25 words."
            }
            return this;
        }
    },
    googleSearch: function(){
        this.config.tools = [{googleSearch: {}}]
        console.log("made it to googleSearch");
        return this;
        
    },
    removeOutput: function(){
        this.content = {
            role: "user",
            parts: [{ text: this.input }],
        }
        this.config = {
            systemInstruction: `The user wants to remove something from their database which is built like ${JSON.stringify(comicBookDbTemplate)}, generate needed response`,
            ...updateConfig
        }
        return this;
 
    },

    addIssueResearch: function(){
        this.content = {
            role: "user",
            parts: [{ text: this.input }],
        }
        this.config = {
            systemInstruction: `the user needs these fields filled out, ${JSON.stringify(issueRundownTemplate)}, do the necessary research based on the issue the user wants to add`,
        }
        return this;
    },
    structureResearch: function(research){
        this.content = {
            role: "user",
            parts: [{ text: research }],
        }
        this.config = {
            systemInstruction: `based on the issue research the user supplied, put everything in the structured output`,
            ...issueRundownConfig
        }
        return this
    },

    add: async function(){
        const json = this.json;
        try{
            const update = json.updateAndOption.update;
            const filter = json.updateAndOption.filter;
            const result = await this.collection.updateOne(filter, update);
            this.config = {
            systemInstruction: `The user added something and here is the result: ${JSON.stringify(result)}, generate a response to them`
            }
            return this;    
        }
        catch(err){
            console.log(err);
            this.config = {
                systemInstruction: "The user attempted to add an issue to their comic collection but it went wrong, explain so it no less than 25 words."
            }
            return this;
        }
                    
    },

    remove: async function(){
        const { filter, update } = this.json.updateAndOption;
        try {
            const result = await this.collection.updateOne(filter, update);
            this.config = {
                systemInstruction: `The user successfully removed something from their comic collection, ${JSON.stringify(result)} is the result`
            }
        }
        catch(err){
            console.error(err);
            this.config = {
                systemInstruction: "The user attempted to remove an issue to their comic collection but it went wrong, explain so it no less than 25 words."
            }
        }
        return this;
    },
    trivia: function(){
        this.content = {
            role: "user",
            parts: [{ text: this.input }],
        }
        this.config = {
            systemInstruction: "The user is asking a trivia question, research and answer",
        }
        return this;
    },
    unsure: function(){
        this.content = {
            role: "user",
            parts: [{ text: this.input }],
        }
        this.config = {
            systemInstruction: "Tell the user it is uncertain what they are asking and they should ask again",
        }
        return this;
    },
    view: async function(){
        const json = this.json;
        const aggregates = json.arrayOfAggregates
        try{
            const result = await this.collection.aggregate(aggregates).toArray();
            this.config = {
                systemInstruction: `The user asked about their comic collection and here are the result: ${JSON.stringify(result)}`,
            }
            return this;
        }
        catch(err){
            console.error(err);
            this.config = {
                systemInstruction: `The user asked about their comic collection but something went wrong`,
            }
        }
        return this;
    },
    analyzeInput: function(){
        this.content = {
            role: "user",
            parts: [{ text: this.input }],
        }
        this.config = {
            systemInstruction: "Determine the action the use wants to take based on their input",
            ...decideConfig
        }
        console.log("made it to analyze input");
        
        return this;
    },
    generatePromptGemini:async function() {
        return await getResponse(this.content, this.config);
    },
    generateJson: async function(){
        const unparsedJson = await getResponse(this.content, this.config);
        console.log("made it to generateJson");
        
        
        this.json = JSON.parse(unparsedJson);
        
        return this
    }
    
}    