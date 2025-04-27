import { updateTemplate, aggregateTemplate, comicBookDbTemplate, triviaTemplate, unsureTemplate } from "./templates.js";

export const Actions = {
    header: "",
    task: "",
    redisSub: "",
    chatSession: "",
    input: "",
    collection: "",

    construct: function(redisPub, chatSession, input, collection){
        this.redisPub = redisPub;
        this.chatSession = chatSession;
        this.input = input
        this.collection = collection
        return this;
    },

    updateHistory: async function(agentReply){
        await Promise.all([
            this.redisPub.lPush(this.chatSession, "User: " + this.input),
            this.redisPub.lPush(this.chatSession, "Agent: " + agentReply)
        ]) 
    },

    add: async function(key){
        if (key.beingAddedOrRemoved === "issue"){
            try{
                const update = key.updateAndOption.update;
                const filter = key.updateAndOption.filer;
                const result = await collection.updateOne(filter, update);  
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
        this.header = `You added something to the users collection and here is the result ${result}`;
        this.task = "generate a response for the user based on their input and result in no more than 25 words";
        return this;
    }, 

    remove: async function(agentOutput){
        const { filter, update } = agentOutput.updateAndOption
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
    view: async function(agentOutput){
        const aggregates = agentOutput.arrayOfAggregates
        const result = await this.collection.aggregate(aggregates).toArray();
        this.header = `You completed an operation to get feedback from the database based on the user input and here is the result: ${JSON.stringify(result)}`;
        this.task = "Generate a response for the user to read";
        return this;
    },
    analyzeInput: function(token){
        this.header = `you will take the role of a comic book trivia expert, and be used inside a comic book management application, with a mongodb database. Return ONLY a json object`;
        this.task = `${JSON.stringify(comicBookDbTemplate)} is the structure of the document and the template you will follow for generating filters, updates and array of aggregates, return a filled out version of eithere of these templates: ${JSON.stringify(aggregateTemplate)}; ${JSON.stringify(updateTemplate)}; ${JSON.stringify(triviaTemplate)}: ${JSON.stringify(unsureTemplate)}; so i can JSON.parse(yourReply) and use the aggregate or update option, add a match for the token: ${token}. if it deist apply then leave the field null, and if an issue is being added, fill out the correct info, also when adding always set {"$exists":false}, also the database i use to autofill the issue details only fills out the image, description and name feild, could ou get the accurate info for the artist, writer, editor, and name. keep the filter and update field inside updateAndOptions. Make sure it is in json format `;
        return this;
    },
    generatePromptGemini:async function() {
        return{
            role: "comic book trivia expert, and user comic book database manager",
            header: this.header,
            task: this.task,
            userInput: this.input,
            // history: await this.redisPub.lRange(this.chatSession, 0, -1)
        }
    }
    
}    