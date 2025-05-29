from typing_extensions import Literal, Optional, Any
from pydantic import BaseModel, Field
from typing_extensions import TypedDict


class State(TypedDict):
    input: str
    decision: str
    output: str
    token: str
    results: str
    agent_response: str
    filter_key: dict
    update_key: dict
    collection: Any


class ComicDetails(TypedDict):
    name: str = Field(description="include the official name for the story, if there is more than one story in an issue include both names seperated by a ; example the name of the story from Amazing Spider-man issue 5 vol 1 is 'Marked for Destruction by Dr. Doom!' ")
    artist: str = Field(description="the artist for the issue")
    writer: str = Field(description="the writer for the issue")
    first_appearances: Optional[str] = Field(description="any possible first appearances, leave blank if no")
    major_deaths: Optional[str] = Field(description="any possible major deaths, leave blank if no")
    costume_changes: Optional[str] = Field(description="any possible costume changes, leave blank if no")
    story_arc: Optional[str] = Field(description="any possible major story arc, leave blank if no")
    crossovers : Optional[str] = Field(description="any possible crossovers, leave blank if no")
    release_date: str = Field(description="the release date of the issue fro example may 2, 1987")


class UpdateComics(BaseModel):
    character: str = Field(description="Name of the character the title belongs to")
    title_type: Literal["Series", "Mini-Series", "One-Shot"] = Field(description="type of the title being added to")
    title: str = Field(description="Name of the title for example Uncanny X-men")
    vol: int = Field(description="The volume number of the series")
    issue_number: int = Field(description="Issue number")        



class ClassifyTasks(TypedDict):
    action: Literal["add_general", "remove", "check_collection", "add_comics"]
    task: str = Field(description="description of the task so i know ")


class Tasks(BaseModel):
    tasks: list[ClassifyTasks] = Field(description="amount of tasks the user wants to execute")


class Route(BaseModel):
    step: Literal["trivia", "comic_collection", "unsure"] = Field(
        None, description="The next step in the routing process"
    )
    
class FilterAndUpdateForAdd(BaseModel):
    being_set: str = Field(description="the field being $set for example characters.Spider-man.Series.Amazing Spider-man.vol 1.70")
    being_updated: str = Field(description="the field being updated")

class FilterAndUpdateForRemove(BaseModel):
    being_unset: str = Field(description="the field being $unset for example characters.Spider-man.Series.Amazing Spider-man.vol 1.70")
    being_updated: str = Field(description="the field being removed")


class Aggregates(BaseModel):
    aggregates: list[dict] = Field(description="an array of aggregates for the mongodb database")    
    


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
