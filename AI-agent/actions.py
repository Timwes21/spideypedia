from models import State, issueRundownTemplate

from llm import(
    get_comic_details,
    get_aggregates,
)

from helper_functions import (
    google_search, 
    get_update_details, 
    format_comic_details, 
    get_filter_and_update_keys, 
)


def check_collection(task, state: State):
    aggregates = get_aggregates(task, state)
    result = list(state['collection'].aggregate(aggregates))
    return {"result": result}


def add_comics(task, state: State):
    content = f"fill out this template: {issueRundownTemplate} about for the issue that the user wants to add, user input: " + task  
    search_results = google_search(content)
    comic_details = get_comic_details.invoke(search_results)
    update_details = get_update_details(task)
    filter_key = {"tokens": state["token"]}
    formatted_details = format_comic_details(comic_details)
    update_key = {"$set": {f"characters.{update_details.character}.{update_details.title_type}.{update_details.title}.vol {update_details.vol}.{update_details.issue_number}.issueRundown": formatted_details}}
    result = state['collection'].update_one(filter_key, update_key)
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