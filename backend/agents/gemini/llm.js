import { GoogleGenAI } from "@google/genai";
import 'dotenv/config'

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
export async function getResponse(content){
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: JSON.stringify(content),
        config: {
            tools: [{googleSearch: {}}],
        },
    });
    return response.text
}

export async function getKey(content){
    const response = await getResponse(content, "and ensure its in json form so i can parse it");
    console.log(response);
    
    const cleaningResponse = response.replace("json", "");
    const finalResponse = cleaningResponse.split("```")[1];
    return JSON.parse(finalResponse);
    }


