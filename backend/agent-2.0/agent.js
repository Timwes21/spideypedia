import { decryptToken } from '../db/token-handler.js';
import { getKey, getResponse} from './gemini/llm.js';
import { Actions } from "./actions.js";
import 'dotenv/config';
// import { getJson, getResponse } from './groq/llm.js';



class Agent{
    constructor(){
        this.ActionHandler = {...Actions};
    }

    async analyzeInput(encryptedToken, input, redisPub, collection) {
        const token = decryptToken(encryptedToken);

        const messages = await this.ActionHandler
                            .construct(redisPub, chatSession, input, collection)
                            .analyzeInput(token)
                            .generatePromptGemini();
        
        const agentOutput = await getKey(messages);
            
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
                                    .generatePromptGemini(); 
            case "trivia":
            case "unsure":
                return await this.ActionHandler
                                [action]()
                                .generatePromptGemini();
                
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