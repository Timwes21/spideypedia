export const issueRundownTemplate ={
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


export const comicBookDbTemplate = {
    tokens: "",
    characters:{
        "Spider-man":{
            Series: {
                "Amazing Spider-man": {
                    "vol 1":{
                        1:{  
                            issueRundown: {...issueRundownTemplate},
                            image: {
                                url: null,
                                pubicID: null
                            },
                        },
                    "vol 2": {
                        15: {
                            issueRundown:{...issueRundownTemplate},
                            image: {
                                url: null,
                                pubicID: null
                            },
                        }
                    }
                    
                    }
                }
            }
        }
    }}




export const aggregateTemplate = {
    arrayOfAggregates: "example",
}

export const viewTemplate = {
    action: "checkDatabase",
    userInput: "Do i have Amazing Spider-man vol 1 issue 11?"

}


export const updateTemplate = {
    updateAndOption: {
        filter: "",
        update: ""
    },
}


export const addTemplate = {
    action: "add",
    "beingAdded": "issue || title  || character",
    "issue": {issueNumber: "", titleOfSeries: "", seriesStartYear: ""},
    userInput: "Add Amazing Spider-man vol 1 issue 11?"

}

export const addManyIssueTemplate = {
    action: "addManyIssues",
    userInput: "Add Amazing Spider-man vol 1 issue 1-20?",
}


export const addManyIssuePromptTemplate = {
    issueDetails: {titleName: "", vol: "", character: "", type: "Series || Mini-Series || One-Shot"},
    issuesNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9 ]

}


export const removeTemplate ={
    action: "remove",
    userInput: "Remove Amazing Spider-man vol 1 issue 11?"
}


export const triviaTemplate = {
    action: "trivia",
    userQuestion: "",
    userInput: "When was Captain America created?"
}

export const unsureTemplate = {
    action: "unsure",
}

