import { decryptToken } from '../db/token-handler.js';
import { getKey, getResponse} from './gemini/llm.js';
import { Actions } from "./actions.js";
import 'dotenv/config';
// import { getJson, getResponse } from './groq/llm.js';



class Agent{
    constructor(){
        this.ActionBuilder = {...Actions};
    }

    async analyzeInput(encryptedToken, input, collection) {
        const token = decryptToken(encryptedToken);
        console.log("analyzing input");
        const prompt = this.ActionBuilder
                            .construct(input, collection, token)
                            .analyzeInput()
                            .generatePromptGemini();
    
        
        const agentOutput = await getKey(prompt);
            
        return agentOutput;
    }



    async handleAction(agentOutput){
        console.log("handling output");
        
        const action = agentOutput.action;
        
        switch(action){
            case "add":
            case "checkDatabase":
            case "remove": {
                
                const prompt = this.ActionBuilder[action + "Prompt"]()
                                    .generatePromptGemini();

                const agentOutput = await getKey(prompt, this.model);

                return this.ActionBuilder
                                [action](agentOutput)
                                .then(ActionBuilder=>ActionBuilder
                                .generatePromptGemini()); 
                }
            case "trivia":
            case "unsure":
                return await this.ActionBuilder
                                [action]()
                                .generatePromptGemini();
                
        }
    }

    
            
    async handleTask(token, input, collection){
        const inputAnalysis = await this.analyzeInput(token, input, collection);
        const actionResults = await this.handleAction(inputAnalysis);
        console.log(actionResults);
        const agentReply = await getResponse(actionResults);
        
        return agentReply;
    }
    
    async execute(token, input, collection){
        try{   
            return await this.handleTask(token, input, collection);
        }
        catch(err){
            console.log(err);
            return await this.handleTask(token, input, collection);            
        }
    }
}

export default Agent