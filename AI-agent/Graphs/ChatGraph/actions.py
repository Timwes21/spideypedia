from utils.schemas import State

from utils.helper_functions import (
    get_filter_and_update_keys, 
    get_comic_info,
    add_photo
)


async def add_comics(task, state: State=None, image=None, username=None):
    token = state["token"]
    collection = state["collection"]
    formatted_details, update_details = await get_comic_info(task, token, collection)
    issue_rundown = {"issueRundown": formatted_details}
    if image:
        image_name = f"{username}/{update_details.character}/{update_details.title_type}/{update_details.title}/{update_details.vol}.{update_details.issue_number}"
        image_path = await add_photo(collection, image, token, image_name)
        issue_rundown["imageName"] = image_path
    update_key = {"$set": {f"characters.{update_details.character}.{update_details.title_type}.{update_details.title}.vol {update_details.vol}.{update_details.issue_number}": issue_rundown}}
    result = await collection.update_one({"tokens": token}, update_key)
    return result

async def add_general(task, state: State):
    label = "$set"
    update_details = await get_filter_and_update_keys(task, label)
    result = state['collection'].update_one({"tokens": state["token"]}, {label: {update_details.being_set: update_details.being_updated}})
    return result

async def remove(task, state: State):
    label = "$unset"
    update_details = await get_filter_and_update_keys(task, label)
    result = state['collection'].update_one({"tokens": state["token"]}, {label: {update_details.being_unset: update_details.being_updated}})
    return result








actions = {
    "add_general": add_general,
    "remove": remove, 
    "add_comics": add_comics
}