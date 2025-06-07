from google.genai.types import Tool, GenerateContentConfig, GoogleSearch
from google import genai
import os
from langchain_core.messages import HumanMessage, SystemMessage
from models import Tasks, FilterAndUpdateForRemove, FilterAndUpdateForAdd
from langchain.output_parsers import PydanticOutputParser
from langchain_core.prompts import ChatPromptTemplate
from llm import get_filter_and_update_keys_for_add_from_llm, get_filter_and_update_keys_for_remove_from_llm, get_update_details_from_llm, llm
from models import convert_names_for_comic_details, comicBookDbTemplate, issueRundownTemplate

def google_search(content):
    api_key = os.environ['API_KEY']
    client = genai.Client(api_key=api_key)
    model_id = "gemini-2.0-flash"
    google_search_tool = Tool(
        google_search = GoogleSearch()
    )
    
    response = client.models.generate_content(
        model=model_id,
        contents=content,
        config=GenerateContentConfig(
            tools=[google_search_tool],
            response_modalities=["TEXT"],
        )
    )
    parts = response.candidates[0].content.parts
    search_results = ""
    for part in parts:
        search_results += part.text
    print(search_results)
    return search_results


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
    for key, value in comic_details.items():
        if "No" not in value:
            new_key = convert_names_for_comic_details[key]
            formatted_details[new_key] = value
    return formatted_details


def get_update_details(user_input):
    content = f"the user want to add something to their comic collection being handles in mondodb and is structured like {comicBookDbTemplate} give me an update key and the content that is being $set, user input: {user_input}"
    result = get_update_details_from_llm.invoke(content)
    return result


def get_tasks_chain(user_input):
    parser = PydanticOutputParser(pydantic_object=Tasks)
    prompt = ChatPromptTemplate.from_template("You are part of an agentic system, which handles the users comic collection, create a list of tasks based on how many actions the user wants to execute with their collection, if the user is adding a comic issue plaese make sure the action is add_comic, if adding anyting else do add_general. The program hinges on the distinction between add_general and add_comics. If removing you can return remove and if asking about the collection return check_collection: {user_input} {format}").partial(format=parser.get_format_instructions())
    chain = prompt | llm | parser
    return chain.invoke({"user_input": user_input})



def add_by_photo(image_url, production_collection, token):
    characters: dict = production_collection.find_one({"tokens": token}, {"characters": 1, "_id": 0})
    characters = characters['characters']
    new_dict = {}    
    
    for character_name, character_contents in characters.items():
        if character_name not in new_dict:
            new_dict[character_name] = {}
        for title_type, titles in character_contents.items():
            if title_type not in new_dict[character_name]:
                new_dict[character_name][title_type] = {}
            for title_name, n in titles.items(): 
                new_dict[character_name][title_type][title_name]={}
            
    parser = PydanticOutputParser(pydantic_object=PhotoUploadInfo)
    
    system_message = SystemMessage(
        content=[
            {"type": "text",
            "text": "You are being used in a mobile app that handles tracking the users comic collection, return the necessary data for it to be added"},
            {"type":"text",
            "text": "Now since successfully adding to mongodb take specificity, when returning the title and character name, be sure the grammar matches the title and charcatrs name in the users mongodb collection if it exists, otherwise it will be added under a new character and/or title section. For example Spider-Man is normally typed as Spider-man but if in the necessary info about the users collection, it is 'Spiderman you make the character Spiderman'"},
            {"type": "text",
            "text": f"in json format give me the info like this: {parser.get_format_instructions()}"}
        ]
    )
    
    
    message = HumanMessage(
        content=[
            {"type": "image_url", "image_url": image_url},
        ],
    )
    
    result = llm.invoke([system_message, message], tools=[GenAITool(google_search={})])
    
    formatted_results = parser.parse(result.content)
    
        

    
    name = formatted_results.name
    artist = formatted_results.artist
    writer = formatted_results.writer
    first_appearances = formatted_results.first_appearances
    major_deaths = formatted_results.major_deaths
    costume_changes = formatted_results.costume_changes
    story_arc = formatted_results.story_arc
    crossovers = formatted_results.crossovers
    release_date = formatted_results.release_date
    character = formatted_results.character
    title_type = formatted_results.title_type
    title = formatted_results.title
    vol = formatted_results.vol
    issue_number = formatted_results.issue_number
    
    print(formatted_results)
    
    production_collection.update_one