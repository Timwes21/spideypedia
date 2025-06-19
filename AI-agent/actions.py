from models import State, issueRundownTemplate, ComicDetails
from langchain.output_parsers import PydanticOutputParser

from llm import(
    get_comic_details,
    get_aggregates,
)

from helper_functions import (
    google_search_with_filter, 
    get_update_details, 
    format_comic_details, 
    get_filter_and_update_keys, 
    get_char_and_title
)


def check_collection(task, state: State):
    aggregates = get_aggregates(task, state)
    result = list(state['collection'].aggregate(aggregates))
    return {"result": result}


def add_comics(task, state: State):
    parser = PydanticOutputParser(pydantic_object=ComicDetails)
    content = f"You are an ai agent that gets accurate info about the new issue the user is adding, but befroe the adding agent can add it to the colection, you need to get the required info about the issue the user is adding. Be sure to get the correct character, title type, title, volume, and issue number when researching, user input: {task}, {parser.get_format_instructions()} "
    comic_details = google_search_with_filter(content, ComicDetails)
    print("comic details: ", comic_details)
    update_details = get_update_details(task)
    formatted_details = format_comic_details(comic_details.model_dump())
    character, title = get_char_and_title( update_details, state["token"], state["collection"])
    update_key = {"$set": {f"characters.{character}.{update_details.title_type}.{title}.vol {update_details.vol}.{update_details.issue_number}.issueRundown": formatted_details}}
    result = state['collection'].update_one({"tokens": state["token"]}, update_key)
    return result

def add_general(task, state: State):
    label = "$set"
    update_details = get_filter_and_update_keys(task, label)
    result = state['collection'].update_one({"tokens": state["token"]}, {label: {update_details.being_set: update_details.being_updated}})
    return result

def remove(task, state: State):
    label = "$unset"
    update_details = get_filter_and_update_keys(task, label)
    result = state['collection'].update_one({"tokens": state["token"]}, {label: {update_details.being_unset: update_details.being_updated}})
    return result








actions = {
    "add_general": add_general,
    "remove": remove, 
    "check_collection": check_collection,
    "add_comics": add_comics
}