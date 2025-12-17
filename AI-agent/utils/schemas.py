from typing_extensions import Literal, Optional, Any, TypedDict, Union
from pydantic import BaseModel, Field
from langchain_core.messages import HumanMessage, AIMessage


class State(TypedDict):
    input: str
    decision: str
    output: str
    token: str
    results: str
    filter_key: dict
    update_key: dict
    collection: Any
    chat: list[dict]
    username: str


class ComicDetails(BaseModel):
    name: str = Field(description="include the official name for the story, if there is more than one story in an issue include both names seperated by a '/'. Example: the name of the story from Amazing Spider-man issue 1 vol 1 is 'Spider-Man, Freak! Public Menace! / The Chameleon Strikes!' ")
    artist: str = Field(description="the artist for the issue")
    writer: str = Field(description="the writer for the issue")
    first_appearances: str | None = Field(description="any possible first appearances, leave blank if no", default=None)
    major_deaths: str | None = Field(description="any possible major deaths, leave blank if no", default=None)
    costume_changes: str | None = Field(description="any possible costume changes, leave blank if no", default=None)
    story_arc: str | None = Field(description="any possible major story arc, leave blank if no", default=None)
    crossovers: str | None = Field(description="any possible crossovers, leave blank if no", default=None)
    release_date: str = Field(description="the release date of the issue fro example may 2, 1987")


class UpdateComics(BaseModel):
    character: str = Field(description="Name of the character the title belongs to")
    title_type: Literal["Series", "Mini-Series", "One-Shot"] = Field(description="type of the title being added to")
    title: str = Field(description="Name of the title for example Uncanny X-men")
    vol: int = Field(description="The volume number of the series", examples=["1", "2"])
    issue_number: int = Field(description="Issue number")        

class PhotoUploadInfo(ComicDetails, UpdateComics):
    ...


class ClassifyTasks(TypedDict):
    action: Literal["add_general", "remove", "add_comics"]
    task: str = Field(description="description of the task so i know ")


class Tasks(BaseModel):
    tasks: list[ClassifyTasks] = Field(description="amount of tasks the user wants to execute")


class Route(BaseModel):
    step: Literal["update_comic_collection", "check_comic_collection", "unsure"] = Field(description="The next step in the routing process")
    
class FilterAndUpdateForAdd(BaseModel):
    being_set: str = Field(description="the field being $set for example characters.Spider-man.Series.Amazing Spider-man.vol 1.70")
    being_updated: str = Field(description="the field being updated")

class FilterAndUpdateForRemove(BaseModel):
    being_unset: str = Field(description="the field being $unset for example characters.Spider-man.Series.Amazing Spider-man.vol 1.70")
    being_updated: str = Field(description="the field being removed")


class Aggregates(BaseModel):
    aggregates: list[dict] = Field(description="an array of aggregates for the mongodb database")    
    
class Message(BaseModel):
    role: str
    content: str = Field(description="the message")
    
class CurrentMessages(BaseModel):
    messages: list[Union[AIMessage, HumanMessage]]

class ChatFate(BaseModel):
    end: bool

class MetaData(BaseModel):
    metadata: str

class FactsAboutUser(MetaData):
    data: str

class SummaryOfConvo(MetaData):
    summary: str

class Imporvements(MetaData):
    what_to_improve: str | None



class Username(BaseModel):
    username: str

class Facts(BaseModel):
    facts: list[FactsAboutUser]
    

issueRundownTemplate ={
        "name": "include the official name for the story, if there is more than one story in an issue inlcude both names seperated by a ; example the name of the story from amazing spiderman issue 5 vol 1 is 'Marked for Destruction by Dr. Doom!' ",
        "artist": "",
        "writer": "",
        'first Appearances': "",
        'major_deaths': "",
        'costume_changes': "",
        'story_arc': "", 
        'crossovers' : "",
        'publication_date': "May 1963 for example",
    }

convert_names_for_comic_details = {
    "name": "Name",
    "artist": "Artist",
    "writer": "Writer",
    "first_appearances": "First Appearances",
    "major_deaths": "Major Deaths",
    "costume_changes": "Costume Changes",
    "story_arc": "Story Arc",
    "crossovers" : "Crossovers",
    "release_date": "Publication Date"
}


comicBookDbTemplate = {
    "tokens": [],
    "characters":{
        "Spider-man":{
            "Series": {
                "Amazing Spider-man": {
                    "vol 1":{
                        1:{  
                            "issueRundown": issueRundownTemplate,
                            "image": {
                                "url": "",
                                "pubicID": ""
                            },
                        },
                    "vol 2": {
                        15: {
                            "issueRundown":issueRundownTemplate,
                            "image": {
                                "url": "",
                                "pubicID": ""
                            },
                        }
                    }
                    
                    }
                }
            }
        }
    }}
