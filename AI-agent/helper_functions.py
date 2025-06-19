from google.ai.generativelanguage_v1beta.types import Tool as GenAITool  
from models import Tasks, FilterAndUpdateForRemove, FilterAndUpdateForAdd
from langchain.output_parsers import PydanticOutputParser
from langchain_core.prompts import ChatPromptTemplate
from llm import get_update_details_from_llm, llm
from models import convert_names_for_comic_details, comicBookDbTemplate
import json

def google_search_with_filter(content, parser):
    result = llm.invoke(content, tools=[GenAITool(google_search={})])
    print(result.content)
    print(type(result.content))
    final_result = result.content if isinstance(result.content, str) else result.content[1].split("```")[1].replace("json", "")
    return parser.parse(final_result)
    
def google_search(content):
    result = llm.invoke(content, tools=[GenAITool(google_search={})])
    return result.content

def get_filter_and_update_keys(task, label):
    is_add = label == "$set"
    action = "add" if is_add else "remove"
    pydantic_object = FilterAndUpdateForAdd if is_add else FilterAndUpdateForRemove
    parser = PydanticOutputParser(pydantic_object=pydantic_object)
    prompt = ChatPromptTemplate.from_template("You are part of an agentic system that handles operations for a comic collection being handled in mongodb. It is structured like {comicBookDbTemplate}, produce an update feild to {action} what the user wants to and be sure to make the update field in dot notation. Task: {task} {format}").partial(action=action, format=parser.get_format_instructions(), comicBookDbTemplate=comicBookDbTemplate)
    chain = prompt | llm | parser
    update_and_filter = chain.invoke({"task": task})
    return update_and_filter


def format_comic_details(comic_details):
    formatted_details = {}
    print(comic_details)
    for key, value in comic_details.items():
        if value != None:
            new_key = convert_names_for_comic_details[key]
            formatted_details[new_key] = value
    return formatted_details


def get_update_details(user_input):
    content = f"the user want to add something to their comic collection being handles in mondodb and is structured like {comicBookDbTemplate} give me an update key and the content that is being $set, user input: {user_input}"
    result = get_update_details_from_llm.invoke(content)
    print(type(result))
    return result


def get_tasks_chain(user_input):
    parser = PydanticOutputParser(pydantic_object=Tasks)
    prompt = ChatPromptTemplate.from_template("You are part of an agentic system that updates the users comic collection beng handles in mongodb. You are to break down the users request into managable tasks. Each task should have no more than one action, for example adding more than one issue/item at a time, removing more than one issue/item, or checking for one issue/item at a time. This makes sure the database is as precise as possible. Each task will fall under these categories: add_comic for adding only comic issues, add_general for anything that isnt a comic issue, remove for removing anything, and check_collection for checking the users collection. : {user_input} {format}").partial(format=parser.get_format_instructions())
    chain = prompt | llm | parser
    return chain.invoke({"user_input": user_input})

def get_char_and_title(details, token, collection):
    character = details.character
    title = details.title
    title_type = details.title_type
    characters: dict = collection.find_one({"tokens": token}, {"characters": 1, "_id": 0})
    characters = characters['characters']
    
    character_map = {name.lower(): name for name in characters.keys()}
    
    
    title_map = {
            char_name : {
                name.lower(): name
                for name in characters[char_name][title_type].keys()
            }
            for char_name in characters.keys() if title_type in characters[char_name]
        }
    
    
    char_lowered = character.lower()
    if char_lowered in character_map:
        character = character_map[char_lowered]
        title_lowered = title.lower()
        if title_lowered in title_map[character]:
            title = title_map[character][title_lowered]
    return (character, title)

