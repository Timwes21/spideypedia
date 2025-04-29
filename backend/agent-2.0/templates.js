import { Type } from "@google/genai"
import { request } from "http"


export const comicBookDbTemplate = {
    token: "",
    characters:{
        "Spider-man":{
            Series: {
                "Amazing Spider-man": {
                    "vol 1":{
                        1:{  
                            issueRundown:{
                                Name: "include the official name for the story, if there is more than one story in an issue inlcude both names seperated by a ; example the name of the story from amazing spiderman issue 5 vol 1 is 'Marked for Destruction by Dr. Doom!' ",
                                Artist: "",
                                Writer: "",
                                'First Appearances': null,
                                'Major Deaths': null,
                                'Costume Changes': null,
                                'Story Arc': null, 
                                Crossovers : "",
                                'Publication Date': "May 1963 for example",
                            },
                            image: null,
                        },
                    "vol 2": {
                        15: {
                            issueRundown:{
                                Name: "include the official name for the story, if there is more than one story in an issue inlcude both names seperated by a ; example the name of the story from amazing spiderman issue 5 vol 1 is 'Marked for Destruction by Dr. Doom!' ",
                                Artist: "",
                                Writer: "",
                                'First Appearances': null,
                                'Major Deaths': null,
                                'Costume Changes': null,
                                'Story Arc': null, 
                                Crossovers : "",
                                'Publication Date': "May 1963 for example",
                            },
                            image: null,
                        }
                    }
                    
                    }
                }
            }
        }
    }}

export const issueRundownTemplate={
        Name: "include the official name for the story, if there is more than one story in an issue inlcude both names seperated by a ; example the name of the story from amazing spiderman issue 5 vol 1 is 'Marked for Destruction by Dr. Doom!' ",
        Artist: "",
        Writer: "",
        'First Appearances': null,
        'Major Deaths': null,
        'Costume Changes': null,
        'Story Arc': null, 
        Crossovers : "",
        'Publication Date': "May 1963 for example",
}

export  const issueRundownConfig = {
    responseMimeType: 'application/json',
    responseSchema: {    
        type: Type.OBJECT,
        properties: {
            "issueRundown": {
                type: Type.OBJECT,
                properties: {
                    "Name": {
                        type: Type.STRING,
                        description: "include the official name for the story, if there is more than one story in an issue inlcude both names seperated by a ; example the name of the story from amazing spiderman issue 5 vol 1 is 'Marked for Destruction by Dr. Doom!' ",
                        nullable: false
                    },
                    "Artist": {
                        type: Type.STRING,
                        description: "Name of the artists(s) for the issue",
                        nullable: false
                    },
                    "Writer": {
                        type: Type.STRING,
                        description: "Name of the writer(s) for the issue",
                        nullable: false
                    },
                    "First Appearances": {
                        type: Type.STRING,
                        description: "include any first appearances of major characters or side characters",
                        nullable: false
                    },
                    "Major Deaths": {
                        type: Type.STRING,
                        description: "Include any major deaths",
                        nullable: false
                    },
                    "Costume Changes": {
                        type: Type.STRING,
                        description: "Include any costume changes",
                        nullable: false
                    },
                    "Story Arc": {
                        type: Type.STRING,
                        description: "Include the name of the story arc, for example Kraven's Last Hunt part 2",
                        nullable: true
                    },
                    "Crossovers" : {
                        type: Type.STRING,
                        description: "Include any characters or groups that make an appearance",
                        nullable: true
                    },
                    "Publication Date": {
                        type: Type.STRING,
                        description: "The release data of the issue being added, for example May 21, 1987",
                        nullable: false
                    }
                }
            }
        }
    },
}
export const aggregateTemplate = {
    responseMimeType: 'application/json',
    responseSchema: {
        type: Type.OBJECT,
        properties: {
            "arrayOfAggregates": {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {

                    }
                }
                
            }
        },
        required: ["arrayOfAggregates"],
    }
}

export const updateConfig = {
    responseMimeType: 'application/json',
    responseSchema: {
        type: Type.OBJECT,
        properties: {
            "updateAndOption" : {
                type: Type.OBJECT,
                properties : {
                    "filter": {
                        type: Type.STRING,
                        description: "filter argument for the updateOne function for MongoDb",
                        nullable: false
                    },
                    "update" : {
                        type: Type.STRING,
                        description: "update argument for the updateOne function for MongoDb, ensure its valid json so i can parse it",
                        nullable: false
                        
                    },
                },
                required: ["filter", "update"]
            },
        }
    }     
}
    




export const decideConfig = {
    responseMimeType: 'application/json',
    responseSchema: {
        type: Type.OBJECT,
        properties: {
            "action" : {
                type: Type.STRING,
                description: "addOther || addIssue || remove || trivia || view || unsure",
                nullable: false
            }
        },
        required: ["action"]
    }
}