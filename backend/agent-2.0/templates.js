export const comicBookDbTemplate = {
    token: "",
    characters:{
        "Spider-man":{
            Series: {
                "Amazing Spider-man": {
                    "vol 1":{
                        1:{  
                            name: "include name for the story, if there is more than one story in an issue inlcude both names seperated by a ;",
                            description: "one sentence summary of each story in an issue",
                            issue: "number",
                            creators: {
                                artist: "",
                                writer: "",
                                editor: ""
                            },
                            keyIssue: "true || false",
                            keyIssueFlags: {
                                firstAppearancesOfMajorCharacter: "leave null if none",
                                DeathOfMajorCharacter: "leave null if none",
                                costumeChanges: "leave null if none",
                                majorStoryArcs: "leave null if none", 
                                crossovers: "leave null if none"
                            },
                            image: "leave null",
                            publicationDate: "",
                            publisher: "marvel/dc/ect."

                            }
                        },
                    "vol 2": {
                        15: {
                            name: "include name for the story, if there is more than one story in an issue inlcude both names seperated by a ;",
                            description: "one sentence summary of each story in an issue",
                            issue: "number",
                            creators: {
                                artist: "",
                                writer: "",
                                editor: ""
                            },
                            keyIssue: "true || false",
                            keyIssueFlags: {
                                firstAppearancesOfMajorCharacter: "leave null if none",
                                DeathOfMajorCharacter: "leave null if none",
                                costumeChanges: "leave null if none",
                                majorStoryArcs: "leave null if none", 
                                crossovers: "leave null if none"
                            },
                            image: "leave null",
                            publicationDate: "",
                            publisher: "marvel/dc/ect."
}
                    }
                    
                    }
                }
            }
        }
    }


export const aggregateTemplate = {
    arrayOfAggregates: "example",
    action: "view",
}

export const updateTemplate = {
    updateAndOption: {
        filter: "",
        update: ""
    },
    action: "add || remove",
    "beingAddedOrRemoved": "issue || title  || character",
    "issue": {issueNumber: "", titleOfSeries: "", seriesStartYear: ""}
}

export const triviaTemplate = {
    action: "trivia",
    userQuestion: ""
}

export const unsureTemplate = {
    action: "unsure",
}

