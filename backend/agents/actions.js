import { updateTemplate, aggregateTemplate, comicBookDbTemplate, triviaTemplate, unsureTemplate, viewTemplate, addTemplate, removeTemplate } from "./templates.js";


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

    addPrompt: function (){
        this.header = "The user wants to add to their comic collection being handled in a mongodb database, the structure of the database looks like this: " + JSON.stringify(comicBookDbTemplate);
        this.task = `fill out this template so i can JSON.parse() it : ${JSON.stringify(updateTemplate)} with the user token: ${this.token}` 
        return this;
    },
    add: async function(key){
        console.dir(key, {depth:null});
        
        if (key.beingAddedOrRemoved === "issue"){
            try{
                const update = key.updateAndOption.update;
                const filter = key.updateAndOption.filter;
                const result = await this.collection.updateOne(filter, update);  
                this.header = `You added an issue to the users comic collection and here is the result: ${JSON.stringify(result)}`;
                this.task = "generate a response based on the result and user input in no more than 25 words";
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
        return this;
    }, 
    removePrompt: function (){
        this.header = "The user wants to remove something from their comic collection being stored in a mongodb database"
        this.task = `fill out this template so i can JSON.parse() it : ${JSON.stringify(updateTemplate)} with the user token: ${this.token}`
        return this;
    },

    remove: async function(agentOutput){
        const { filter, update } = agentOutput.updateAndOption;
        // const key  = Object.keys(update['$unset'])[0];
        // const field = update['$unset'][key];
        const result =  await this.collection.updateOne(filter, update);
        this.header = `you are part of a comic management application. You provided a pipeline to aggregate the mongodb db and the results were: ${result}`;
        this.task = "formulate ONLY a response for the user as this will be read by them, If the user asked about the data and results are empty or undefined provide a response indicating nothing was found.";
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
        this.task = `return one of these templates based in the users input, in json form so i can JSON.parse() them: ${JSON.stringify(addTemplate)}; ${JSON.stringify(removeTemplate)}; ${JSON.stringify(triviaTemplate)}; ${JSON.stringify(viewTemplate)}; ${JSON.stringify(unsureTemplate)}`;
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