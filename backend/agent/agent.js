import { decryptToken } from '../db/token-handler.js';
import { getKey, getResponse } from './llm.js';
import { Actions } from "./prompts.js";
import 'dotenv/config';



class Agent{
    constructor(){
        this.ActionHandler = {...Actions};
    }

    async analyzeInput(encryptedToken, input, redisPub) {
        const token = decryptToken(encryptedToken);
        const chatSession = "chat:session:" + token;

        const prompt = await this.ActionHandler
                            .construct(redisPub, chatSession, input)
                            .analyzeInput(token)
                            .generatePrompt();
        
        const agentOutput = getKey(prompt);
        return agentOutput;
    }



    async handleAction(agentOutput){
        const action = agentOutput.action;
        
        switch(action){
            case "add":
            case "check":
            case "remove":
                return await (await this.ActionHandler
                                    [action](agentOutput))
                                    .generatePrompt(); 
            case "trivia":
            case "unsure":
                return await this.ActionHandler
                                [action]()
                                .generatePrompt();
                
        }
    }
    
            
    async handleTask(token, input, redisPub){
        const inputAnalysis = await this.analyzeInput(token, input, redisPub);
        const actionResults = await this.handleAction(inputAnalysis);
        const agentReply = await getResponse(actionResults);
        return agentReply;
    }
}

export default Agent