import { GoogleGenAI } from "@google/genai";
// import { addDeclaration, removeDeclaration, viewDeclaration, triviaDeclaration } from "../function-declarations.js";
import 'dotenv/config'
// import { comicBookDbTemplate } from "../templates.js";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getResponse(content, config){
    const response = await ai.models.generateContent({
        model: "gemini-1.5-pro",
        contents: content,
        config: config
    });
    console.log("made it to the getResponse");
    
    return response.text;
}

// export async function getFunction(content){
//     const response = await ai.models.generateContent({
//         model: "gemini-2.0-flash",
//         contents: content,
//         config:{
//             systemInstruction: "You are a comic expert and manager of the users comic collection using mongodb, use this for reference for the output if the user " + JSON.stringify(comicBookDbTemplate),
//             tools: [{
//                 functionDeclarations: [addDeclaration, removeDeclaration, viewDeclaration, triviaDeclaration],
//             }]
//         }
//     });
//     return response
// }

// async function google(){
//     const response = await ai.models.generateContent({
//         model: "gemini-2.0-flash",
//         contents: [
//             "Who individually won the most bronze medals during the Paris olympics in 2024?",
//         ],
//         config: {
//             tools: [{googleSearch: {}}],
//         },
//     });
// }


// const result = await getFunction([
//     {
//         role: "user",
//         parts: [{text: "can you add amazing spiderman vol 1 issue 1"}]
//     }
// ])
// console.log("ooga booga" + result.candidates[0].content.parts);
