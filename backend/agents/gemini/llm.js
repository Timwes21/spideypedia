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
        const response = await getResponse(content);
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

// eyJhbGciOiJFZERTQSJ9.eyJwcm9qZWN0IjoiOTdmNDlmZWQ2NmZjNGUzMmI2Yjc3Njk3ZTE0YWE1ZGIiLCJhdWQiOiIzNzM4NjExNjY0MDQzMDM0IiwiZXhwIjo2MDY1MzA2ODMwLCJqdGkiOiI4OGI2OGQ0Zi0yNmJhLTQ2NTQtOWNmNi0xZmRhYTdiMGFkODciLCJpc3MiOiJrZXBsZXIuYWkuY2xvdWQub3ZoLm5ldCIsInN1YiI6Ind0MTEzNzM0LW92aCIsIm92aFRva2VuIjoiTVJDbWJ5dlQxVnJpQlcxTGlpeHNGRFp4Vm5IdThIbHkyTDdMVmUwNVZDMng2X3IydFgwaGxNLU56aHpmaFFzbGI3MTBWVmRURGh1amxUWmJJeFZmbzNyUUxMRlpOd0gyM1BaME9Camx1X2N2Mm9IanhSU2s2ZDd4cHlpd3FLRlNTbXVyUFMzb2NzXzk1cGV1ekJCSGhtS0tCNmtJMFpTaTNHa0NacFpwSXg5TFlON05MRldvZWt5dFJoNWJ3NUZPMURFNlhrRmxpbC1yb0FCSlpoVU1ZdGw3M1pfR1hhT2xoLTVLT0t3V3IwVnRhNjFlUVU2aW1wQkJVSU5FaVR0bjA4RXRORHZCS1RjUUdWRElIcTZCUWpjWm5kRF9xZ1JwTWtHZ3gyYTQtR2NnM3F1YkNaZTFreHZ2cm5aMWFleGc3OGxlM3NXNnJqV0N5QTh1NXVwX0FQNWQ0SEc2anJVNTBIZUlnN24zdkgzRlQ2Yi1Jd2hfdzFUQlZsVm1HTk85aXBuc2IwSWJ2SXBQYVpBRk1GTG12RXBEU19OM0pORUJTSno4TGE4ZXhXRUV2ckxwS2M3VlhqM3AteFJELUhfaFBIa3ZjQmRUTlVrTnZLQ0puSmNfY1otcmRTNmFubElRY1lPMFA3M21DdzM2OVd1OVBrb2hnem0zc3VDMkVyc0RBcDhnOG9lbjJ1NUFhYlVDQnlURUhyTEUyc19yb2ZPZ1c2NHFrQVdocWJ3WHhUSDlRY0REU19LVWVveDJ3WHhtUmdVbVcyV0lrVDN5Rk9sbGgwd2VMSk12Yk95b0pncDA2eVJtS3NDcEhjRVh2OWpubTZPN2hOYzlxQThKZU1ZMExtT0dUTkRJNjhPSUpBbUhaX0l0S1luTkhobWR3MTU0LXBaYXJRNEdIMVk4N2ZXTXVibGIxOVJkN0cwTktvOUktbC1Ndnk3TE9fandDWE82a2xYM3pKN1dsajFYQm5jVS1EeEpzazdmU0pNWm9fSUVMQmt0MkI1M0h5Wk1JenFyMUhaZW5wVDNYZXc0Snl6TURBc05zMWxxQnJ0ZERoZ2dpcnd4ckJ3RnV5dnVZRlh5M3ZoTDJhR0JpTDhqa0RNdHZBbV9leDROeVBaWU9TSlY5VE5EX19HNmtKaGdsMUduMWE3SU04ZUQ2aTRpSVlrSEY4VGtkV2lFNENqNWFBYzQyWGxZWHV1YWk4NHMyNnc5Z2JDV0VOaFF0R0pZNy14SEhJM1JLdGhQd0pFd0YzeVl1NDJsUlN0NEFGRHlER00yd3R5MHN4UDExbEZOSGxOTEVTX0JJcHJRTnh4YjI4dWsxSWNseVVzLUNOZkQifQ.YTuHhkfcVrLVLyiRuZicRUrd-gv8SI5ZEHsjz1nHFQLeX_UykO3wizKWqbK1j-dIWHcOScIDv8gFmxG-cn7MBg

