from google.ai.generativelanguage_v1beta.types import Tool as GenAITool  
from models import Tasks, FilterAndUpdateForRemove, FilterAndUpdateForAdd
from langchain.output_parsers import PydanticOutputParser
from langchain_core.prompts import ChatPromptTemplate
from llm import get_update_details_from_llm, llm
from models import convert_names_for_comic_details, comicBookDbTemplate

def google_search_with_filter(content, parser):
    result = llm.invoke(content, tools=[GenAITool(google_search={})])
    return parser.parse(result.content)
    
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
    prompt = ChatPromptTemplate.from_template("You are part of an agentic system, which handles the users comic collection, create a list of tasks based on how many actions the user wants to execute with their collection, if the user is adding a comic issue plaese make sure the action is add_comic, if adding anyting else do add_general. The program hinges on the distinction between add_general and add_comics. If removing you can return remove and if asking about the collection return check_collection: {user_input} {format}").partial(format=parser.get_format_instructions())
    chain = prompt | llm | parser
    return chain.invoke({"user_input": user_input})

def get_char_and_title(details, token, collection):
    character = details.character
    title = details.title
    title_type = details.title_type
    characters: dict = collection.find_one({"tokens": token}, {"characters": 1, "_id": 0})
    characters = characters['characters']
    for character_name, character_contents in characters.items():
        if character_name.lower() == character.lower():
            character = character_name
            for title_name in character_contents[title_type].keys(): 
                if title_name.lower() == title.lower():
                    title = title_name
    return (character, title)

