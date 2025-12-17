from google.ai.generativelanguage_v1beta.types import Tool as GenAITool  
from utils.schemas import Tasks, FilterAndUpdateForRemove, FilterAndUpdateForAdd, ComicDetails
from utils.schemas import convert_names_for_comic_details, comicBookDbTemplate
from langchain.output_parsers import PydanticOutputParser
from langchain_core.runnables import Runnable
from langchain_core.prompts import ChatPromptTemplate
from utils.llm import get_update_details_from_llm, llm
from utils.minio_client import client
import secrets
import os
import asyncio



def get_chain(model, prompt) -> Runnable:
    parser = PydanticOutputParser(pydantic_object=model)
    prompt = ChatPromptTemplate.from_template(prompt +" {format}").partial(format=parser.get_format_instructions())
    chain = prompt | llm | parser
    return chain

    
async def google_search(content):
    result = await llm.ainvoke(content, tools=[GenAITool(google_search={})])
    return result.content

async def google_search_with_filter(content, filter):
    result = await google_search(content)
    return await llm.with_structured_output(filter).ainvoke(result)

async def get_filter_and_update_keys(task, label):
    is_add = label == "$set"
    action = "add" if is_add else "remove"
    pydantic_object = FilterAndUpdateForAdd if is_add else FilterAndUpdateForRemove
    parser = PydanticOutputParser(pydantic_object=pydantic_object)
    prompt = ChatPromptTemplate.from_template("You are part of an agentic system that handles operations for a comic collection being handled in mongodb. It is structured like {comicBookDbTemplate}, produce an update feild to {action} what the user wants to and be sure to make the update field in dot notation. Task: {task} {format}").partial(action=action, format=parser.get_format_instructions(), comicBookDbTemplate=comicBookDbTemplate)
    chain = prompt | llm | parser
    update_and_filter = await chain.ainvoke({"task": task})
    return update_and_filter


def format_comic_details(comic_details):
    formatted_details = {}
    print("comic details", comic_details)
    for key, value in comic_details.items():
        if value != None:
            new_key = convert_names_for_comic_details[key]
            formatted_details[new_key] = value
    return formatted_details


async def get_update_details(user_input):
    content = f"the user want to add something to their comic collection being handles in mondodb and is structured like {comicBookDbTemplate} give me an update key and the content that is being $set, user input: {user_input}"
    result = await get_update_details_from_llm.ainvoke(content)
    return result


async def get_tasks_chain(user_input):
    prompt = (
        "You are part of an agentic system that updates the users comic collection beng handles in mongodb. " 
        "You are to break down the users request into managable tasks. Each task should have no more than one " 
        "action, for example adding more than one issue/item at a time, removing more than one issue/item, or " 
        "checking for one issue/item at a time. This makes sure the database is as precise as possible. Each " 
        "task will fall under these categories: add_comic for adding only comic issues, add_general for " 
        "anything that isnt a comic issue, remove for removing anything, and check_collection for checking the " 
        "users collection. : {user_input}"
    )
    chain = get_chain(Tasks, prompt)
    return await chain.ainvoke({"user_input": user_input})

async def get_char_and_title(details, token, collection) -> set:
    character = details.character
    title = details.title
    title_type = details.title_type
    characters: dict = await collection.find_one({"tokens": token}, {"characters": 1, "_id": 0})
    characters = characters['characters']
    print("\ncharacters : ", characters, "\n")
    
    character_map = {name.lower(): name for name in characters.keys()}

    
    title_map = {
        char_name: { 
            name.lower(): name # spider-man: Spider-Man
            for name in characters[char_name][title_type].keys()
        }
        for char_name in characters.keys() if title_type in characters[char_name]
    }
    
    print("Title Map: ", title_map, "\n")
    char_lowered = character.lower()
    if char_lowered in character_map:
        character = character_map[char_lowered]
        title_lowered = title.lower()
        print(title_lowered)
        if title_lowered in title_map.get(character, []):
            title = title_map[character][title_lowered]
    return (character, title)


async def get_username(collection, token):
    res = await collection.find_one({"tokens": token}, {"userInfo": 1, "_id":0}) or {}
    user_info = res.get("userInfo", {})
    return user_info.get("username", None)


async def get_comic_info(task, token, collection) -> tuple[dict, ComicDetails]: 
    parser = PydanticOutputParser(pydantic_object=ComicDetails)
    content = (f"""You are an ai agent that gets accurate info about the new issue the user is adding, 
                but before the adding agent can add it to the colection, you need to get the required 
                info about the issue the user is adding. Be sure to get the correct character, title type, 
                title, volume, and issue number when researching, user input, and avoid grabing numeric citations 
                like [1, 4, 6]: Task:{task}, {parser.get_format_instructions()} """)
    
    comic_details: ComicDetails = await google_search_with_filter(content, ComicDetails)
    update_details = await get_update_details(task)
    formatted_details: dict = format_comic_details(comic_details.model_dump())
    update_details.character, update_details.title = await get_char_and_title(update_details, token, collection)
    return formatted_details, update_details
    

async def add_photo(collection, image, token, image_name):
    res = await collection.find_one({"tokens": token}, {"userInfo.username": 1})
    print(res)
    username = res["userInfo"]["username"]
    path = f"{username}/{image_name}"
    bucket_name = os.getenv("BUCKET_NAME", "python-test-bucket")
    func = client.put_object
    args = [bucket_name, path, image.file, image.size]
    await asyncio.to_thread(func, *args)
    return path