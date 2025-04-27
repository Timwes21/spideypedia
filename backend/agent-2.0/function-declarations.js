import { Type } from "@google/genai";

const addDeclaration = {
    name: 'add',
    description: 'Adds to users comic collection',
    parameters: {
      type: Type.OBJECT,
      properties: {
        update: {
          type: Type.STRING,
          description: 'update for the updateOne function based on the user database provided.',
        },
        filter: {
          type: Type.STRING,
          description: 'filer for the updateOne function based on the user database provided.',
        },
        beingAdded: {
          type: Type.STRING,
          description: "what is being added, for example, 'issue'.",
        },
        issueNumber: {
            type: Type.STRING,
            description: "Issue number if an issue is being added for example"
        },
        volume: {
            type: Type.STRING,
            description: "Volume of the series that is being updated, for example 'volume 1'"
        },
        SeriesName: {
            type: Type.STRING,
            description: "Name of the series for example 'Amazing Spider-man'"
        }
      },
      required: ['beingAdded', 'update', 'filter'],
    },
  };


const removeDeclaration = {
    name: 'remove',
    description: 'Removes from users comic collection',
    parameters: {
      type: Type.OBJECT,
      properties: {
        update: {
          type: Type.STRING,
          description: 'update for the updateOne function based on the user database provided.',
        },
        filter: {
          type: Type.STRING,
          description: 'filer for the updateOne function based on the user database provided.',
        }
      },
      required: ['update', 'filter'],
    }
}

const viewDeclaration = {
    name: 'view',
    description: 'uses aggregation to check what is in the users collection based on their input',
    parameters: {
      type: Type.OBJECT,
      properties: {
        aggregates: {
          type: Type.ARRAY,
          items: { type: Type.OBJECT},
          description: 'An array of aggregates to put into the aggregate function',
        },
      },
      required: ['aggregates'],
    }
}

const triviaDeclaration = {
    name: "trivia",
    description: "answers the users trivial question about comic books",
    parameters: {
        type: Type.OBJECT,
        properties: {
            usersQuestion: {
                type: Type.STRING,
                description: "Reiterate the users question"
            }
        },
        required: ['usersQuestion']
    }

}

export {triviaDeclaration, addDeclaration, removeDeclaration, viewDeclaration}