import { decryptToken } from '../db/token-handler.js';
import { Actions } from "./actions.js";
import 'dotenv/config';
// import { getJson, getResponse } from './groq/llm.js';


/* 
    Prototyping a more structured output 
    Not in use because of model usage spike it causes
*/


class Agent{
    constructor(){
        this.ActionBuilder = {...Actions};
    }

    async analyzeInput(encryptedToken, input, collection) {
        const token = decryptToken(encryptedToken);

        await this.ActionBuilder
                    .construct(input, token, collection)
                    .analyzeInput()
                    .generateJson();

    }



    async handleAction(){
        const action = this.ActionBuilder.json.action;
        console.log(action);
        

        switch(action){
            case "addOther":
                return await this.ActionBuilder
                                .addOutput()
                                .generateJson().then(ActionBuilder => ActionBuilder
                                .add().then(ActionBuilder => ActionBuilder
                                .generatePromptGemini()))

            case "addIssue": {
                const research = await this.ActionBuilder
                                    .addIssueResearch()
                                    .googleSearch()
                                    .generatePromptGemini()

                const structuredResearch = await this.ActionBuilder
                                                    .structureResearch(research)
                                                    .generateJson()

                
                
                return await this.ActionBuilder
                                .addOutput()
                                .generateJson().then(ActionBuilder => ActionBuilder
                                .addIssue(structuredResearch.json).then(ActionBuilder => ActionBuilder
                                .generatePromptGemini()))

                        
                        
            }
            case "remove":
            case "view":
                return await this.ActionBuilder[action + "Output"]()
                                .generateJson().then(ActionBuilder => ActionBuilder[action]()
                                .then(ActionBuilder => ActionBuilder
                                .generatePromptGemini()));
                                

            case "trivia":
                return await this.ActionBuilder
                                .trivia()
                                .googleSearch()
                                .generatePromptGemini();
            
            case "unsure":
                return await this.ActionBuilder
                        .unsure()
                        .generatePromptGemini();
        }
    }
    
            
    async handleTask(token, input, collection){        
        await this.analyzeInput(token, input, collection);
        const actionResults = await this.handleAction();
        return actionResults
    }
}

export default Agent