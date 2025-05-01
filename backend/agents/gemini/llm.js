import { GoogleGenAI } from "@google/genai";
import 'dotenv/config'

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
export async function getResponse(content, model){
    const response = await ai.models.generateContent({
        model: model,
        contents: JSON.stringify(content),
        config: {
            tools: [{googleSearch: {}}],
        },
    });
    return response.text
}

export async function getKey(content, model){
        const response = await getResponse(content, model);
        const cleaningResponse = response.replace("json", "");
        const finalResponse = cleaningResponse.split("```")[1];
        return JSON.parse(finalResponse);
    }

    async function google(){

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [
                "Who individually won the most bronze medals during the Paris olympics in 2024?",
            ],
            config: {
                tools: [{googleSearch: {}}],
            },
        });
        return response;
    }

